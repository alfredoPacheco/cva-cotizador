import { Client, Databases, ID, InputFile, Storage } from 'node-appwrite';
import fs from 'fs';

const main = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(Bun.env['APPWRITE_ENDPOINT'])
    .setProject(Bun.env['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(Bun.env['APPWRITE_API_KEY']);

  const databases = new Databases(client);
  const storage = new Storage(client);

  const CARBONE_URL = Bun.env['CARBONE_URL'];
  log('CARBONE_URL: ' + CARBONE_URL);

  const requestedReport = req.query.report;
  log('requestedReport: ' + requestedReport);

  const encodedReport = encodeURIComponent(requestedReport);
  log('encodedReport: ' + encodedReport);

  const destinationPath = './downloaded-file.pdf';

  const href = `${CARBONE_URL}/report/${encodedReport}`;
  log('href: ' + href);

  const body = JSON.stringify({ data: req.body });

  const response = await fetch(href, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
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

    const quotation = JSON.parse(req.body);
    log('about to update quotatino Id: ' + quotation.$id);
    await databases.updateDocument(
      'quotations-db',
      'quotations',
      quotation.$id,
      { reportId: report.$id }
    );
    log('updated quotation!');

    return res.json(report);
  } catch (err) {
    error(err);
  }
};

export default main;

// main({ req: {}, res: {}, log: console.log, error: console.error });
