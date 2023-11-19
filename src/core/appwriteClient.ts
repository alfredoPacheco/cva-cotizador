import { Client, Account, ID, Databases, Storage, Functions } from 'appwrite';

const client = new Client();
client
  .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const functions = new Functions(client);

export { client, account, ID, databases, storage, functions };