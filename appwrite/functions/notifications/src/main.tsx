import { Client, Databases, ID, Query } from 'node-appwrite';
import type { ContactDto, NotificationDto, QuotationDto } from './types';
import dayjs from 'dayjs';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import EmailQuoteUpdate from './templates/EmailQuoteUpdate';

const DEV_CONTACTS: ContactDto[] = [
  {
    email: 'apacheco@inspiracode.net',
    name: 'Freddy Pacheco',
    phone: 'no importa'
  }
];

const FN_RESPONSE = {
  quotationsCreated: [],
  quotationsUpdated: [],
  quotationsDeleted: [],
  quotationsOmitted: []
};

const client = new Client()
  .setEndpoint(Bun.env['APPWRITE_ENDPOINT'])
  .setProject(Bun.env['APPWRITE_FUNCTION_PROJECT_ID'])
  .setKey(Bun.env['APPWRITE_API_KEY']);

const databases = new Databases(client);

const sendNotification = async (
  notification: Partial<NotificationDto>,
  log,
  error
) => {
  log('SEND ALERT', notification);
  try {
    let subject = `Se ha actualizado la siguiente cotización: ${notification.quotationId}`;
    if (notification.notificationType === 'quote-created') {
      subject = `Se ha creado una nueva cotización: ${notification.quotationId}`;
    }

    await sendEmail(
      log,
      error,
      // template,
      subject,
      { quotationId: notification.quotationId },
      notification.to
    );

    await databases.createDocument(
      Bun.env['APPWRITE_DATABASE'],
      'notifications',
      ID.unique(),
      {
        ...notification,
        payload: subject,
        to:
          typeof notification.to === 'string'
            ? notification.to
            : notification.to.map(e => JSON.stringify(e))
      }
    );

    await databases.updateDocument(
      Bun.env['APPWRITE_DATABASE'],
      'quotations',
      notification.quotationId,
      {
        notificationAt: dayjs().add(10, 'seconds').toISOString() // add 10 seconds so notificationAt is greater than $updatedAt
      }
    );
  } catch (e) {
    log('ERROR on sendNotification');
    error(e);
  }
};

const sendEmail = async (
  log,
  error,
  // template: string,
  subject: string,
  params = {} as any,
  to: string | string[] | ContactDto[] = DEV_CONTACTS
) => {
  const recipients =
    typeof to === 'string'
      ? to
      : to
          .map(e => {
            if (typeof e === 'string') {
              return e;
            } else {
              return e.email;
            }
          })
          .filter(e => e);

  if (recipients.length === 0) {
    log('sendEmail: No Recipients provided');
    return;
  }

  log('recipients');
  log(recipients);

  const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: Bun.env['SMTP_HOST'],
    port: Bun.env['SMTP_PORT'],
    secure: Bun.env['SMTP_TLS'] === 'true' || false, // `true` for port 465, `false` for all other ports
    auth: {
      user: Bun.env['SMTP_USER'],
      pass: Bun.env['SMTP_PASSWORD']
    }
  });

  try {
    const mailOptions = {
      from: Bun.env['SMTP_SENDER'],
      to: recipients,
      subject:
        subject || Bun.env['EMAIL_DEFAULT_SUBJECT'] || 'System Notification',
      html: render(
        <EmailQuoteUpdate
          subject={
            subject || Bun.env['EMAIL_DEFAULT_SUBJECT'] || 'System Notification'
          }
          quotationId={params.quotationId}
        />
      )
    };

    const mailResponse = await new Promise((resolve, reject) => {
      try {
        const email = transporter.sendMail(mailOptions);
        setTimeout(() => {
          resolve(email);
        }, 2000);
      } catch (e) {
        reject(e);
      }
    });

    log(mailResponse);
    return true;
  } catch (e) {
    error(e);
    return false;
  }
};

const handleNotification = async (
  {
    payload,
    quotationId,
    recentlySentNotifications,
    level1Suscribers
    // level2Suscribers,
    // level3Suscribers
  },
  log,
  error
) => {
  const now = dayjs();
  const notificationAlreadySent = recentlySentNotifications[0];
  log('notificationAlreadySent');
  log(notificationAlreadySent);

  const notification: Partial<NotificationDto> = {
    sentAt: now.toDate(),
    sentBy: Bun.env['NOTIFICATIONS_SENDER'],
    payload,
    quotationId,
    to: level1Suscribers
  };
  if (!notificationAlreadySent) {
    // notification.level = 1;
    notification.title = 'Cotización creada';
    notification.notificationType = 'quote-created';
    notification.to = level1Suscribers;
    log('create notification');
    log(notification);
    FN_RESPONSE.quotationsCreated.push(quotationId);
    await sendNotification(notification, log, error);
  } else {
    const sentAt = dayjs(notificationAlreadySent.$createdAt);
    const diff = now.diff(sentAt, 'minutes');
    if (diff >= 1) {
      notification.title = 'Cotización actualizada';
      notification.notificationType = 'quote-updated';
      log('update notification');
      log(notification);
      FN_RESPONSE.quotationsUpdated.push(quotationId);
      await sendNotification(notification, log, error);
    } else {
      FN_RESPONSE.quotationsOmitted.push(quotationId);
      log('notification already sent in the last 5 minutes');
    }
  }
};

const main = async ({ req, res, log, error }: any) => {
  const recentQuotations = await databases.listDocuments<QuotationDto>(
    Bun.env['APPWRITE_DATABASE'],
    'quotations',
    [
      Query.limit(9999),
      Query.greaterThanEqual(
        '$updatedAt',
        dayjs().subtract(2, 'hours').toISOString()
      )
    ]
  );

  log('recentQuotations: ' + recentQuotations.documents.length);

  FN_RESPONSE.quotationsOmitted = recentQuotations.documents
    .filter(d => {
      return (
        d.notificationAt !== null &&
        dayjs(d.$updatedAt).isBefore(dayjs(d.notificationAt))
      );
    })
    .map(d => d.$id);

  recentQuotations.documents = recentQuotations.documents.filter(d => {
    return (
      d.notificationAt === null ||
      dayjs(d.$updatedAt).isAfter(dayjs(d.notificationAt))
    );
  });

  log('recentQuotations after filter: ' + recentQuotations.documents.length);

  const quotationsIds = recentQuotations.documents.map(q => q.$id);
  log('quotationsIds: ' + quotationsIds.length);
  log(quotationsIds);

  if (quotationsIds.length === 0) {
    log('No recent updated/created quotations');
  }

  const recentNotifications =
    quotationsIds.length > 0
      ? await databases.listDocuments<NotificationDto>(
          Bun.env['APPWRITE_DATABASE'],
          'notifications',
          [
            Query.select(['$id', '$createdAt', 'quotationId']),
            // Query.greaterThan(
            //   '$createdAt',
            //   dayjs().subtract(2, 'hours').toISOString()
            // ),
            Query.equal('quotationId', quotationsIds)
          ]
        )
      : { documents: [] };

  log('recentNotifications: ' + recentNotifications.documents.length);
  if (recentNotifications.documents.length > 0) log(recentNotifications);

  for await (const quotation of recentQuotations.documents) {
    log('processing quotation:');
    log(quotation.$id);

    const suscribers: ContactDto[] =
      quotation.suscribers?.map(s => JSON.parse(s)) || [];

    suscribers.push(...DEV_CONTACTS);
    log('sucribers');
    log(suscribers);

    const recentlySentNotifications = recentNotifications.documents
      .filter(n => n.quotationId === quotation.$id)
      .sort((a, b) => dayjs(a.$createdAt).unix() - dayjs(b.$createdAt).unix());

    log('recentlySentNotifications');
    log(recentlySentNotifications);

    await handleNotification(
      {
        payload: quotation,
        quotationId: quotation.$id,
        recentlySentNotifications,
        level1Suscribers: suscribers
      },
      log,
      error
    );
  }

  log(JSON.stringify(FN_RESPONSE, null, 2));
  return res.json(FN_RESPONSE);
};

export default main;

// main({
//   req: {},
//   res: { json: console.log },
//   log: console.log,
//   error: console.error
// });
