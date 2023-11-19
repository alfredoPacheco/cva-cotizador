import { Subject } from 'rxjs';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import { isArrayEqual } from './utils.ts';
import type { Models } from 'appwrite';
import { account } from './appwrite.ts';

const authChanged = (auth, nextAuth) => {
  if (
    !isEqual(
      omit(auth, 'SessionId', 'Roles', 'Instances'),
      omit(nextAuth, 'SessionId', 'Roles', 'Instances')
    ) ||
    !isArrayEqual(auth?.Roles || [], nextAuth?.Roles || []) ||
    !isArrayEqual(auth?.Instances || [], nextAuth?.Instances || [])
  ) {
    return true;
  }
  return false;
};

export class AuthService {
  static OnAuthChange = new Subject();
  static auth?: Models.Session;

  static setAuth(value?: Models.Session, quietly = false) {
    if (authChanged(AuthService.auth, value)) {
      AuthService.auth = value;
      if (!quietly) AuthService.OnAuthChange.next(AuthService.auth);
      AuthService.store(AuthService.auth);
    }
  }

  static fillAuthData = async () => {
    const auth = localStorage.getItem('auth') || 'null';
    AuthService.setAuth(JSON.parse(auth));
    return AuthService.auth;
  };

  static store = (auth: Models.Session | undefined | 'undefined') => {
    if (!auth || auth == 'undefined') return;
    localStorage.setItem('auth', JSON.stringify(auth));
  };

  static login = async (instance: string, tokenParam?: string) => {
    try {
      // let token = tokenParam;
      // if (!token) token = AuthService.auth?.BearerToken;
      // const auth = await request(
      //   'GET',
      //   `auth/jwt/${instance}?ExpiresInMinutes=${EXPIRES_IN_MINS}&isQa=${IS_QA}&isDemo=${IS_DEMO}`,
      //   {
      //     Authorization: `Bearer ${token}`
      //   }
      // );
      const auth = await account.getSession('current');
      AuthService.setAuth(auth);
      return AuthService.auth;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  static clearInstances = () => {
    const arrEntriesToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.startsWith('selectedInstance')) {
        arrEntriesToRemove.push(localStorage.key(i) as string);
      }
    }
    for (let i = 0; i < arrEntriesToRemove.length; i++) {
      localStorage.removeItem(arrEntriesToRemove[i]);
    }
  };

  static clearAuth = (quietly = false) => {
    AuthService.setAuth(undefined, quietly);
    localStorage.removeItem('auth');
  };

  static logout = (quietly = false) => {
    AuthService.clearAuth(quietly);
    try {
      account.deleteSession('current');
      // request('GET', 'auth/logout');
    } catch {
      // We do not care server's responses neither an error
    }
  };

  static hasRole = (role: string) => {
    return true;
    // return AuthService.auth?.Roles?.some(r => r == role);
  };

  // static OpenLogin = () => {};

  // private static ResolveLoginPromise(_auth: Models.Session) {}

  // static getSelectedInstance = (username?: string) => {
  //   try {
  //     const key = `selectedInstance.${username || AuthService.auth?.UserName}`;
  //     return JSON.parse(localStorage.getItem(key) || 'null');
  //   } catch {
  //     return null;
  //   }
  // };
}
