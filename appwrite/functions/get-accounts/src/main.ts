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

  // You can log messages to the console
  // log("Hello, Logs!");

  // If something goes wrong, log an error
  // error("Hello, Errors!");

  // The `req` object contains the request data
  // if (req.method === "GET") {
  //   // Send a response with the res object helpers
  //   // `res.send()` dispatches a string back to the client
  //   return res.send("Hello, World!");
  // }

  // // `res.json()` is a handy helper for sending JSON
  // return res.json({
  //   motto: "Build like a team of hundreds_",
  //   learn: "https://appwrite.io/docs",
  //   connect: "https://appwrite.io/discord",
  //   getInspired: "https://builtwith.appwrite.io",
  // });

  if (req.method === 'GET') {
    log('GET users');
    const users = new Users(client);
    const result = await users.list();
    result.users = result.users.map(filterSensitiveData);
    return res.json(result);
  }
};
