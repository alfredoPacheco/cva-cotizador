import { Client, Databases, ID } from 'node-appwrite';
import nodemailer from 'nodemailer';

const DEV_CONTACTS = [
  {
    email: 'apacheco@inspiracode.net',
    name: 'Freddy Pacheco',
    phone: 'no importa',
  },
];

const FN_RESPONSE = {
  ok: true,
  sentEmails: 0,
  response: '',
};

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const main = async ({ req, res, log, error }) => {
  const {
    to = [],
    cc = [],
    bcc = [],
    subject,
    body,
    sentBy = 'system',
    quotationId,
  } = JSON.parse(req.body);
  log('to');
  log(to);

  log('cc');
  log(cc);

  log('bcc');
  log(bcc);

  log('subject');
  log(subject);

  log('body');
  log(body);

  const toRecipients =
    typeof to === 'string'
      ? to
      : to
          .map((e) => {
            if (typeof e === 'string') {
              return e;
            } else {
              return e.email;
            }
          })
          .filter((e) => e);

  log('toRecipients');
  log(toRecipients);

  const ccRecipients =
    typeof cc === 'string'
      ? cc
      : cc
          .map((e) => {
            if (typeof e === 'string') {
              return e;
            } else {
              return e.email;
            }
          })
          .filter((e) => e);

  log('ccRecipients');
  log(ccRecipients);

  const bccRecipients =
    typeof bcc === 'string'
      ? bcc
      : bcc
          .map((e) => {
            if (typeof e === 'string') {
              return e;
            } else {
              return e.email;
            }
          })
          .filter((e) => e);

  log('bccRecipients');
  log(bccRecipients);

  if (
    toRecipients.length === 0 &&
    ccRecipients.length === 0 &&
    bccRecipients.length === 0
  ) {
    log('sendEmail: No Recipients provided');
    FN_RESPONSE.response = 'No Recipients provided';
    FN_RESPONSE.ok = false;
    return res.json(FN_RESPONSE);
  }

  if (!body || body == '<p></p>') {
    log('sendEmail: No body provided');
    FN_RESPONSE.response = 'No body provided';
    FN_RESPONSE.ok = false;
    return res.json(FN_RESPONSE);
  }

  if (!subject) {
    log('sendEmail: No subject provided');
    FN_RESPONSE.response = 'No subject provided';
    FN_RESPONSE.ok = false;
    return res.json(FN_RESPONSE);
  }

  const emailRecord = await databases.createDocument(
    'quotations-db',
    'emails',
    ID.unique(),
    {
      to: toRecipients,
      cc: ccRecipients,
      bcc: bccRecipients,
      subject,
      body,
      sentBy,
      quotationId,
    }
  );

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_TLS === 'true' || false, // `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    const mailOptions = {
      from: process.env.SMTP_SENDER,
      to: toRecipients,
      cc: ccRecipients,
      bcc: bccRecipients,
      subject:
        subject || process.env.EMAIL_DEFAULT_SUBJECT || 'System Notification',
      html: body,
    };

    log('mailOptions');
    log(mailOptions);

    const mailResponse = await transporter.sendMail(mailOptions);

    databases.updateDocument('quotations-db', 'emails', emailRecord.$id, {
      sentAt: new Date(),
      // response: JSON.stringify(email),
    });

    log(mailResponse);
    FN_RESPONSE.sentEmails = 1;
    FN_RESPONSE.ok = true;
    FN_RESPONSE.response = mailResponse;
    return res.json(FN_RESPONSE);
  } catch (e) {
    error(e);
    FN_RESPONSE.ok = false;
    FN_RESPONSE.response = e.message;
    return res.json(FN_RESPONSE);
  }
};

export default main;

// main({
//   req: {
//     body: {
//       to: 'apacheco@inspiracode.net',
//       body: '<h1>Test</h1>',
//       subject: 'Test',
//     },
//   },
//   res: { json: console.log },
//   log: console.log,
//   error: console.error,
// });
