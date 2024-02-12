import { Subject, Subscription } from 'rxjs';
import { AuthService } from './AuthService';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import { type Models } from 'appwrite';
import { account, storage } from './appwriteClient.ts';
import { useEffect } from 'react';
import { effect, signal } from '@preact/signals-react';
import { get } from 'lodash';

const getAccount = async () => {
  const acc = await account.get();
  const prefs = await account.getPrefs();
  acc.prefs = prefs;
  return acc;
};

const BUCKET_ID = import.meta.env.PUBLIC_APPWRITE_STORAGE_AVATARS;

function getAvatarUrl(fileId?: string) {
  if (!fileId) return null;
  const f = storage.getFilePreview(BUCKET_ID, fileId);
  // console.log('f', f);
  return f;
}

function createAuthCentralState() {
  const auth = signal<Models.Session>(null);
  const account = signal<Models.User<Models.Preferences>>(null);
  const avatarHref = signal<string>(null);
  return { auth, account, avatarHref };
}

export const authCentralState = createAuthCentralState();

effect(() => {
  const fileId = get(authCentralState.account.value, 'prefs.avatar');
  if (fileId) {
    authCentralState.avatarHref.value = getAvatarUrl(fileId).href;
  } else {
    authCentralState.avatarHref.value = null;
  }
});

const authChanged = (auth?: Models.Session, nextAuth?: Models.Session) => {
  if (
    !isEqual(
      omit(auth, '$createdAt', '$id', 'expire'),
      omit(nextAuth, '$createdAt', '$id', 'expire')
    )
    // ||
    // !isArrayEqual(auth?.Roles || [], nextAuth?.Roles || []) ||
    // !isArrayEqual(auth?.Instances || [], nextAuth?.Instances || [])
  ) {
    return true;
  }
  return false;
};

const AuthUrl = import.meta.env.PUBLIC_AUTH_URL;

const request = async (method: string, endpoint: string, headers = {}) => {
  try {
    if (!AuthUrl) {
      throw new Error('NEXT_PUBLIC_AUTH_URL is not defined');
    }
    const resp = await fetch(AuthUrl + endpoint, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json', ...headers }
    });
    if (resp.status >= 200 && resp.status < 300) {
      return await resp.json();
    } else {
      throw resp;
    }
  } catch (err) {
    console.error('err', err);
    throw err;
  }
};

export class AuthCentralService {
  static OnAuthChange = new Subject<any>();
  static auth?: Models.Session;
  static jwt?: string;

  static setAuth(value?: Models.Session, quietly = false) {
    if (authChanged(AuthCentralService.auth, value)) {
      AuthCentralService.auth = value;
      authCentralState.auth.value = AuthCentralService.auth;
      if (!quietly)
        AuthCentralService.OnAuthChange.next(AuthCentralService.auth);
      AuthCentralService.store(AuthCentralService.auth);
    }
  }

  static fillAuthData = async () => {
    await AuthService.fillAuthData();
    const auth = localStorage.getItem('authCentral') || 'null';
    AuthCentralService.setAuth(JSON.parse(auth));

    if (!AuthCentralService.auth) {
      // maybe there is an oauth session:
      try {
        const session = await account.getSession('current');
        if (session) {
          AuthCentralService.setAuth(session);
        }
        // const auth = await request('GET', `auth/jwt/any`, undefined, true);
        // const auth = await account.createOAuth2Session('')
        // AuthCentralService.setAuth(auth);
        // eslint-disable-next-line no-empty
      } catch {}
    }

    return AuthCentralService.auth;
  };

  static store = (auth: Models.Session | undefined | 'undefined') => {
    if (!auth || auth == 'undefined') return;
    localStorage.setItem('authCentral', JSON.stringify(auth));
  };

  static login = async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const centralAuth = await account.createEmailSession(email, password);
      AuthCentralService.setAuth(centralAuth);
      const repsonseJwt = await account.createJWT();
      AuthCentralService.jwt = repsonseJwt.jwt;

      // let responseInstances = await request(
      //   'GET',
      //   'appwrite/instances?UserId=' + centralAuth.userId,
      //   { Authorization: `Bearer ${repsonseJwt.jwt}` }
      // );
      // console.log('responseInstances', responseInstances);

      // let instances: string[] = [];
      // try {
      //   instances = JSON.parse(get(responseInstances, 'Meta.Instances', '[]'));
      // } catch {}

      // let loginToInstance = 'any';
      // if (instances.length > 0) {
      //   const selectedInstance = AuthService.getSelectedInstance(
      //     AuthCentralService.auth?.userId
      //   );
      //   if (
      //     !!selectedInstance?.Identifier &&
      //     instances.includes(selectedInstance.Identifier)
      //   ) {
      //     loginToInstance = selectedInstance.Identifier;
      //   } else {
      //     loginToInstance = instances[0];
      //   }
      // }

      // await AuthService.login(
      //   loginToInstance,
      //   centralAuth.userId,
      //   repsonseJwt.jwt
      // );

      return centralAuth;
    } catch (e) {
      console.error(e);
      throw 'Invalid credentials';
    }
  };

  static clearAuth = (quietly = false) => {
    AuthCentralService.setAuth(undefined, quietly);
    localStorage.removeItem('authCentral');
    AuthService.clearAuth();
  };

  static logout = (quietly = false) => {
    AuthCentralService.clearAuth(quietly);
    AuthService.logout(quietly);
    try {
      account.deleteSession('current');
    } catch {
      // We do not care server's responses neither an error
    }
  };

  static hasRole = (role: string) => {
    return true;
  };

  static OpenLogin = () => {};
  static RequestLogin = async () => {
    AuthCentralService.clearAuth();
    AuthCentralService.OpenLogin();
  };

  static DisplayForbiddenError = () => {};
  static ShowForbiddenError = () => {
    AuthCentralService.DisplayForbiddenError();
  };

  static useAuthSuscription = ({
    openLogin,
    closeLogin
  }: {
    openLogin: () => {};
    closeLogin: (dialogId?: string, feedback?: any) => void;
  }) => {
    useEffect(() => {
      let subscription: Subscription | undefined;

      async function init() {
        await AuthCentralService.fillAuthData();
        AuthCentralService.OpenLogin = openLogin;
        // AuthCentralService.DisplayForbiddenError = openForbidden;
        subscription = AuthCentralService.OnAuthChange.subscribe(() => {
          if (!AuthCentralService.auth) AuthCentralService.RequestLogin();
          else closeLogin();
        });

        if (!AuthCentralService.auth) {
          AuthCentralService.RequestLogin();
        }

        // const currentPath = router.pathname;
        // const findRoute = pages.findIndex(
        //   e => (e as any).href.toLowerCase() == currentPath.toLowerCase()
        // );

        // setState({
        //   loading: false,
        //   currentTab: findRoute > -1 ? findRoute : false
        // });
      }

      init();

      return () => {
        subscription?.unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  };
}

effect(() => {
  if (authCentralState.auth.value) {
    getAccount()
      .then(acc => {
        authCentralState.account.value = acc;
      })
      .catch(() => {
        authCentralState.account.value = null;
        AuthCentralService.RequestLogin();
      });
  } else {
    authCentralState.account.value = null;
  }
});
