import { Client, Users } from 'node-appwrite';

const filterSensitiveData = user => {
  const { hash, hashOptions, password, ...filteredUser } = user;
  return filteredUser;
};
// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }: any) => {
  // Why not try the Appwrite SDK?
  const client = new Client()
    .setEndpoint('https://app.do.inspiracode.com/v1')
    .setProject(Bun.env['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(Bun.env['AUTH_API_KEY']);

  if (req.method === 'GET') {
    log('GET users');
    const users = new Users(client);
    const result = await users.list();
    result.users = result.users.map(filterSensitiveData);
    return res.json(result);
  }
};
