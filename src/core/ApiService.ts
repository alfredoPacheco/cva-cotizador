import axios, { type Method } from 'axios';
import { nanoid } from 'nanoid';
// import { AuthCentralService } from './AuthCentralService';
// import { AuthService } from './AuthService';
import toCacheKey from './toCacheKey';

const AxiosCancelToken = axios.CancelToken;

const Request = async (
  method: Method,
  urlPath: string,
  data: any,
  BaseURL?: string | null,
  abortSignal?: AbortSignal
) => {
//   if (AuthService.auth == null) AuthCentralService.fillAuthData();

  try {
    let url = new URL(urlPath);

    const baseUrl = BaseURL; // || AuthService.auth?.BaseURL;
    if (!baseUrl) {
      console.warn('Missing BaseURL.');
      // throw new Error('Missing BaseURL.');
    } else {
      url = new URL(urlPath, baseUrl);
    }

    const response = await axios(url.href, {
      method,
      data,
    //   headers: {
    //     Authorization: `Bearer ${
    //       AuthService.auth?.BearerToken || AuthCentralService.jwt
    //     }`
    //   },
      signal: abortSignal
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response);
      if (error.response.status === 401) {
        // AuthCentralService.RequestLogin();
      }
      if (error.response.status === 403) {
        // AuthCentralService.ShowForbiddenError();
      }
      if (error.response.data) {
        console.error(error.response.data);
        throw error.response.data;
      } else {
        throw error;
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request);
      throw error.request;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
      throw error;
    }
  }
};

interface ICancelablePromise {
  promise: Promise<any>;
  cancel(): any;
}

export const makeCancelable = (
  promiseWithToken: (token: any) => Promise<any>
): ICancelablePromise => {
  let hasCanceled_ = false;
  const source = AxiosCancelToken.source();
  const promise = promiseWithToken(source.token);
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val =>
      hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
    );
    promise.catch(error =>
      hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
    );
  });

  //react-query:
  (wrappedPromise as any).cancel = () => {
    source.cancel('canceled');
    hasCanceled_ = true;
  };

  return {
    promise: wrappedPromise,
    cancel() {
      source.cancel('canceled');
      hasCanceled_ = true;
    }
  };
};

const setIdempotencyKey = cacheKey => {
  const id = nanoid(10);
  localStorage.setItem('idempotency', JSON.stringify({ cacheKey, id }));
  return id;
};

const getIdempotencyKey = () => {
  try {
    return JSON.parse(localStorage.getItem('idempotency') || 'null');
  } catch {
    return null;
  }
};

const generateIdempotencyId = (required, ...args) => {
  let cacheKey = toCacheKey(...args);
  let current = getIdempotencyKey();
  if (current?.cacheKey !== cacheKey) {
    return setIdempotencyKey(cacheKey);
  } else {
    // TODO: should we throw exception? or
    // should we alert the user to re-send?
    if (required) {
      throw new Error('Se ha prevenido re-envio de operacion.');
    }
    return current.id;
  }
};

//Short Aliases to Request calls:
const Get = async (
  urlPath: string,
  baseURL?: string | null,
  abortSignal?: AbortSignal
) => await Request('GET', urlPath, null, baseURL, abortSignal);

const Post = async (
  urlPath: string,
  data?: any,
  baseURL?: string,
  idemp = false
) => {
  const idempotencyId = generateIdempotencyId(idemp, urlPath, data, baseURL);
  return await Request('POST', urlPath, { ...data, idempotencyId }, baseURL);
};

const Put = async (
  urlPath: string,
  data?: any,
  baseURL?: string,
  idemp = false
) => {
  const idempotencyId = generateIdempotencyId(idemp, urlPath, data, baseURL);
  return await Request('PUT', urlPath, { ...data, idempotencyId }, baseURL);
};

const Patch = async (
  urlPath: string,
  data?: any,
  baseURL?: string,
  idemp = false
) => {
  const idempotencyId = generateIdempotencyId(idemp, urlPath, data, baseURL);
  return await Request('PATCH', urlPath, { ...data, idempotencyId }, baseURL);
};

const Delete = async (
  urlPath: string,
  data?: any,
  baseURL?: string,
  idemp = false
) => {
  const idempotencyId = generateIdempotencyId(idemp, urlPath, data, baseURL);
  return await Request('DELETE', urlPath, { ...data, idempotencyId }, baseURL);
};

export { Request, Get, Post, Put, Patch, Delete, AxiosCancelToken };
