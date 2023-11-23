import { Client, Users, ID } from 'node-appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }: any) => {
  try {
    const client = new Client()
      .setEndpoint('https://app.do.inspiracode.com/v1')
      // @ts-ignore
      .setProject(Bun.env['APPWRITE_FUNCTION_PROJECT_ID'])
      // @ts-ignore
      .setKey(Bun.env['AUTH_API_KEY']);

    const users = new Users(client);

    const splitPath = req.path.split('/');
    log('path: ' + req.path);
    log('splitPath: ' + splitPath);
    const userId = splitPath.length > 1 ? splitPath[1] : null;
    log('userId: ' + userId);

    if (req.method === 'GET') {
      if (req.path === '/identities') {
        log('listIdentities');
        // @ts-ignore
        const result = await users.listIdentities();
        return res.json(result);
      }

      if (req.path === '/') {
        log('listUsers');
        const result = await users.list();
        // result.users = result.users.map(filterSensitiveData);
        return res.json(result);
      }

      if (req.path.includes('/prefs')) {
        log('listPrefs');
        const result = await users.getPrefs(userId);
        // result.users = result.users.map(filterSensitiveData);
        return res.json(result);
      }

      if (req.path.includes('/memberships')) {
        log('listMemberships');
        const result = await users.listMemberships(userId);
        // result.users = result.users.map(filterSensitiveData);
        return res.json(result);
      }

      if (req.path.includes('/phone/activate')) {
        log('activatePhone');
        const result = await users.updatePhoneVerification(userId, true);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/phone/deactivate')) {
        log('deactivatePhone');
        const result = await users.updatePhoneVerification(userId, false);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/email/activate')) {
        log('emailActivate');
        const result = await users.updateEmailVerification(userId, true);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/email/deactivate')) {
        log('emailDeactivate');
        const result = await users.updateEmailVerification(userId, false);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/activate')) {
        log('activateUser');
        const result = await users.updateStatus(userId, true);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/deactivate')) {
        log('deactivateUser');
        const result = await users.updateStatus(userId, false);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/logs')) {
        log('listUserLogs');
        const result = await users.listLogs(userId);
        return res.json(result);
      }

      if (req.path.includes('/sessions')) {
        log('listUserSessions');
        const result = await users.listSessions(userId);
        return res.json(result);
      }

      log('getUser');
      const result = await users.get(userId);
      // const response = filterSensitiveData(result);
      return res.json(result);
    }
    log('here');
    log(req.method);

    if (req.method === 'DELETE') {
      if (req.path.includes('/identities')) {
        log('deleteIdentity');
        const id = splitPath.length > 2 ? splitPath[3] : null;
        log('identityId:');
        log(id);
        // @ts-ignore
        const result = await users.deleteIdentity(userId, id);
        return res.json({ result });
      }

      if (req.path.includes('/sessions')) {
        log('deleteAllUserSessions');
        const result = await users.deleteSessions(userId);
        return res.json({ result });
      }

      if (req.path.includes('/session')) {
        log('deleteSession');
        const id = splitPath.length > 2 ? splitPath[3] : null;
        log('sessionId:');
        log(id);
        const result = await users.deleteSession(userId, id);
        return res.json({ result });
      }

      log('deleteUser');
      const result = await users.delete(userId);
      // const response = filterSensitiveData(result);
      return res.json({ result });
    }

    let body;

    try {
      body = JSON.parse(req.body);
    } catch (err) {
      body = {};
    }

    if (req.method === 'POST') {
      log('createUser');
      // log(req.body);
      // log('type of req.body: ' + typeof req.body); ==> string
      const { email, password, name, phone } = body;
      log('email: ' + email);
      log('password: ' + password);
      log('name: ' + name);
      log('phone: ' + phone);
      const result = await users.create(
        ID.unique(),
        email,
        undefined,
        // phone,
        password,
        name
      );
      // const response = filterSensitiveData(result);
      return res.json(result);
    }

    if (req.method === 'PATCH') {
      if (req.path.includes('/email')) {
        log('updateEmail');
        const { email } = body;
        const result = await users.updateEmail(userId, email);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/name')) {
        log('updateName');
        const { name } = body;
        const result = await users.updateName(userId, name);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/password')) {
        log('updatePassword');
        const { password } = body;
        const result = await users.updatePassword(userId, password);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/phone')) {
        log('updatePhone');
        const { phone } = body;
        const result = await users.updatePhone(userId, phone);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }

      if (req.path.includes('/prefs')) {
        log('updatePrefs');
        const { prefs } = body;
        const result = await users.updatePrefs(userId, prefs);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }
    }

    if (req.method === 'PUT') {
      if (req.path.includes('/labels')) {
        log('updateLabels');
        const { labels } = body;
        log(labels);
        // @ts-ignore
        const result = await users.updateLabels(userId, labels);
        // const response = filterSensitiveData(result);
        return res.json(result);
      }
    }

    return res.json({ error: 'Not implemented' });
  } catch (err) {
    error('An error occurred:');
    error(err);
    return res.json({ error: err });
  }
};
