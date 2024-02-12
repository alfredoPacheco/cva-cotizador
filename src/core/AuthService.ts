import type { IUserAuth } from './Contract';
import { Subject } from 'rxjs';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import { isArrayEqual } from './utils';

const AuthUrl = import.meta.env.PUBLIC_AUTH_URL;
const IS_QA = import.meta.env.PUBLIC_IS_QA || false;
const IS_DEMO = import.meta.env.PUBLIC_IS_DEMO || false;
const EXPIRES_IN_MINS = 60 * 24 * 3;

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
    AuthService.clearInstances();
    throw err;
  }
};

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

  static auth?: IUserAuth;
  static setAuth(value?: IUserAuth, quietly = false) {
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

  static store = (auth: IUserAuth | undefined | 'undefined') => {
    if (!auth || auth == 'undefined') return;
    localStorage.setItem('auth', JSON.stringify(auth));
  };

  static login = async (
    instance: string,
    userId: string,
    tokenParam?: string
  ) => {
    try {
      let token = tokenParam;
      if (!token) token = AuthService.auth?.BearerToken;
      const auth = await request(
        'GET',
        `appwrite/auth/jwt/${instance}?UserId=${userId}&ExpiresInMinutes=${EXPIRES_IN_MINS}&isQa=${IS_QA}&isDemo=${IS_DEMO}`,
        {
          Authorization: `Bearer ${token}`
        }
      );
      AuthService.setAuth(auth);
      return AuthService.ResolveLoginPromise(AuthService.auth!);
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
      request('GET', 'auth/logout');
    } catch {
      // We do not care server's responses neither an error
    }
  };

  static hasRole = (role: string) => {
    return AuthService.auth?.Roles?.some(r => r == role);
  };

  // static OpenLogin = () => {};

  private static ResolveLoginPromise(_auth: IUserAuth) {}

  static getSelectedInstance = (appwriteUserId?: string) => {
    try {
      const key = `selectedInstance.${
        appwriteUserId || AuthService.auth?.UserName
      }`;
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
      return null;
    }
  };
}
