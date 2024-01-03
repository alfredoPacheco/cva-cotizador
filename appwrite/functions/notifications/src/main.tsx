import { Client, Databases, ID, Query, Storage } from 'node-appwrite';
import type { ContactDto, NotificationDto, QuotationDto } from './types';
import dayjs from 'dayjs';
import nodemailer from 'nodemailer';

const DEV_EMAILS = ['apacheco@inspiracode.net'];

const client = new Client()
  .setEndpoint(Bun.env['APPWRITE_ENDPOINT'])
  .setProject(Bun.env['APPWRITE_FUNCTION_PROJECT_ID'])
  .setKey(Bun.env['APPWRITE_API_KEY']);

const databases = new Databases(client);
const storage = new Storage(client);

const sendNotification = async (
  notification: Partial<NotificationDto>,
  log,
  error
) => {
  log('SEND ALERT', notification);
  try {
    const emailSent = await sendEmail(
      log,
      error,
      undefined,
      notification.payload,
      notification.to
    );
    if (emailSent) {
      await databases.createDocument(
        Bun.env['APPWRITE_DATABASE'],
        'notifications',
        ID.unique(),
        { ...notification, to: JSON.stringify(notification.to) }
      );
    }
  } catch (e) {
    log('ERROR on sendNotification');
    error(e);
  }
};

// TODO use groups instead of unique to
const sendEmail = async (
  log,
  error,
  theSubject: string,
  message: string,
  to: string | string[] | ContactDto[] = DEV_EMAILS
) => {
  if (to.length === 0) {
    log('sendEmail: No email provided');
    return;
  }

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

  log('recipients');
  log(recipients);

  const transporter = nodemailer.createTransport({
    host: Bun.env['SMTP_HOST'],
    port: Bun.env['SMTP_PORT'],
    secure: Bun.env['SMTP_TLS'] === 'true' || false, // `true` for port 465, `false` for all other ports
    auth: {
      user: Bun.env['SMTP_USER'],
      pass: Bun.env['SMTP_PASSWORD']
    }
  });

  for (const recipient of recipients) {
    try {
      log('about to sendEmail to: ' + recipient);

      const subject =
        theSubject || Bun.env['EMAIL_DEFAULT_SUBJECT'] || 'System Notification';

      const mailOptions = {
        from: Bun.env['SMTP_SENDER'],
        // from: 'no-reply@siafrac.com',
        to: recipient,
        subject,
        // text: subject,
        html: '<b>Hello world</b>'
      };

      console.log('mail options', mailOptions);

      const mailResponse = await new Promise((resolve, reject) => {
        try {
          const email = transporter.sendMail(mailOptions);
          setTimeout(() => {
            resolve(email);
          }, 500);
        } catch (e) {
          reject(e);
        }
      });

      log(mailResponse);

      // if (!response.ok) throw new Error('Error');

      // const json = await response.json();
      // log(json);
      // // return json
      // return true;
    } catch (e) {
      error(e);
      return false;
    }
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
    await sendNotification(notification, log, error);
  } else {
    const sentAt = dayjs(notificationAlreadySent.$createdAt);
    const diff = now.diff(sentAt, 'minutes');
    if (diff >= 5) {
      notification.title = 'Cotización actualizada';
      notification.notificationType = 'quote-updated';
      log('update notification');
      log(notification);
      return;
      await sendNotification(notification, log, error);
    }
  }
};

const main = async ({ req, res, log, error }: any) => {
  const response = {
    quotationsCreated: 0,
    quotationsUpdated: 0,
    quotationsDeleted: 0
  };

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

  const quotationsIds = recentQuotations.documents.map(q => q.$id);
  log('quotationsIds: ' + quotationsIds.length);
  log(quotationsIds);

  if (quotationsIds.length === 0) {
    log('No recent updated quotations');
    response.quotationsUpdated = 0;
  }

  const recentNotifications = await databases.listDocuments<NotificationDto>(
    Bun.env['APPWRITE_DATABASE'],
    'notifications',
    [
      Query.select(['$id', '$createdAt', 'quotationId']),
      // @ts-ignore
      Query.greaterThan('$createdAt', dayjs().subtract(2, 'hours').toDate()),
      Query.equal('quotationId', quotationsIds)
    ]
  );

  log('recentNotifications: ' + recentNotifications.documents.length);
  log(recentNotifications);

  for (const quotation of recentQuotations.documents) {
    log('processing quotation:');
    log(quotation.$id);

    const suscribers: ContactDto[] = JSON.parse(
      (quotation.suscribers || '[]') as string
    );
    suscribers.push({
      email: DEV_EMAILS[0],
      name: 'Freddy Pacheco',
      phone: 'no importa'
    });
    log('sucribers');
    log(suscribers);

    const recentlySentNotifications = recentNotifications.documents
      .filter(n => n.quotationId === quotation.$id)
      .sort((a, b) => dayjs(a.$createdAt).unix() - dayjs(b.$createdAt).unix());

    log('recentlySentNotifications');
    log(recentlySentNotifications);

    handleNotification(
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
};

export default main;

main({ req: {}, res: {}, log: console.log, error: console.error });
