import { Client, Databases } from 'node-appwrite';

const DEV_CONTACTS = [
  {
    email: 'apacheco@inspiracode.net',
    name: 'Freddy Pacheco',
    phone: 'no importa',
  },
];

const FN_RESPONSE = {
  quotationsCreated: [],
  quotationsUpdated: [],
  quotationsDeleted: [],
  quotationsOmitted: [],
};

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const main = async ({ req, res, log, error }) => {
  log('Start');
};

export default main;

main({
  req: {},
  res: { json: console.log },
  log: console.log,
  error: console.error,
});
