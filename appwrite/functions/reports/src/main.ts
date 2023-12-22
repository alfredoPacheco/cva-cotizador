import { Client, ID, InputFile, Storage } from 'node-appwrite';
import fs from 'fs';

const main = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(Bun.env['APPWRITE_ENDPOINT'])
    .setProject(Bun.env['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(Bun.env['APPWRITE_API_KEY']);

  const storage = new Storage(client);

  const CARBONE_URL = Bun.env['CARBONE_URL'];
  log('CARBONE_URL: ' + CARBONE_URL);

  const requestedReport = encodeURIComponent(
    '/cva/cotizador/cva-cotizacion.docx'
  );
  log('requestedReport: ' + requestedReport);
  const url = new URL(
    `/report/${requestedReport}`.replace(/([^:]\/)\/+/g, '$1'),
    CARBONE_URL
  );
  const href = url.href;
  log('href: ' + href);

  const destinationPath = './downloaded-file.pdf';

  const response = await fetch(href, {
    method: 'POST',
    headers: {
      Accept: 'application/pdf',
      'Content-Type': 'application/pdf'
    }
  });

  async function downloadFile() {
    try {
      const fileStream = fs.createWriteStream(destinationPath);

      await new Promise(async (resolve, reject) => {
        fileStream.on('finish', () => {
          log('File downloaded and saved: ' + destinationPath);
          resolve('ok');
        });

        fileStream.on('error', err => {
          reject(err);
        });

        for await (const chunk of response.body) {
          fileStream.write(chunk);
        }
        fileStream.end();
      });
    } catch (error) {
      error('Error downloading the file: ' + error);
    }
  }

  await downloadFile();

  try {
    const report = await storage.createFile(
      'reports',
      ID.unique(),
      InputFile.fromPath(destinationPath, 'report.pdf')
    );
    log('report:');
    log(report);
    return res.json({ ok: true });
  } catch (err) {
    error(err);
  }
};

export default main;

// main({ req: {}, res: {}, log: console.log, error: console.error });
