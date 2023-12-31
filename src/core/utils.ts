import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import set from 'lodash/set';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import xorWith from 'lodash/xorWith';
import dayjs from 'dayjs';
import { AppwriteException } from 'appwrite';

export const makeQueryParameters = ({
  filterOptions,
  sortOptions,
  defaultSort,
  staticQueryParams
}: any) => {
  let result = '?';

  Object.getOwnPropertyNames(filterOptions).forEach(prop => {
    if (typeof filterOptions[prop] !== 'object' && filterOptions[prop]) {
      result += prop + '=' + filterOptions[prop] + '&';
    }
  });

  if (Object.keys(sortOptions).length > 0) defaultSort = {};

  const sort = { ...(defaultSort || {}), ...(sortOptions || {}) };

  Object.getOwnPropertyNames(sort).forEach(prop => {
    switch (sort[prop]) {
      case 'asc':
        result += 'OrderBy=' + prop + '&';
        break;
      case 'desc':
        result += 'OrderByDesc=' + prop + '&';
    }
  });

  if (staticQueryParams)
    if (
      staticQueryParams instanceof Object ||
      typeof staticQueryParams == 'object'
    )
      Object.getOwnPropertyNames(staticQueryParams).forEach(prop => {
        result += `&${prop}=${staticQueryParams[prop]}`;
      });
    else result += staticQueryParams || '';

  return result;
};

export const stringify = (json: string) => {
  return JSON.stringify(json, null, 2);
};

export const getParameterByName = (name: string, url = '') => {
  if (typeof window === 'undefined') return undefined;
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i'),
    results = regex.exec(url);
  if (!results) return undefined;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const formatCurrency = (number: number, decimals = 2) => {
  if (!isNaN(number) && number >= 0) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    }).format(number);
  }
  return '';
};

export const formatMonthStringValue = (string: string | number) => {
  if (!string) return '';
  return dayjs(string).format('MMM');
};

export const filterEmptyItemsFromProp = (
  fromObject: any,
  path: string,
  inPlace = false,
  ignoredProps: string[] = []
) => {
  const cloned = cloneDeep(fromObject);
  const list = get(cloned, path);
  if (list && isArray(list)) {
    const filtered = list.filter(d => {
      return Object.getOwnPropertyNames(d).some(
        prop =>
          !['Entry_State', ...ignoredProps].includes(prop) &&
          d[prop] !== undefined &&
          d[prop] !== ''
      );
    });
    set(cloned, path, filtered);
    if (inPlace) {
      set(fromObject, path, filtered);
    }
  }
  return cloned;
};

export const filterEmptyItems = (list: any[], ignoredProps: string[] = []) => {
  if (isArray(list)) {
    const filtered = list.filter(d => {
      return Object.getOwnPropertyNames(d).some(
        prop =>
          !['Entry_State', ...ignoredProps].includes(prop) &&
          d[prop] !== undefined &&
          d[prop] !== ''
      );
    });
    return filtered;
  }
  return list;
};

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateEmail = (value: string = '') => {
  return !!value?.match(EMAIL_REGEX);
};

export const handleErrors = (
  err: any,
  notifyError: (msg: string, ms?: number) => void,
  i18n = {}
) => {
  if (typeof err === 'string') {
    notifyError(get(i18n, err, err), 10000);
    return;
  }
  if (err instanceof AppwriteException) {
    if (err.code === 401) {
      notifyError('No tiene permisos para realizar esta acción', 8000);
      return;
    }
    notifyError(get(i18n, err.message, err.message), 8000);
    return;
  }
  if (typeof err === 'object') {
    if (err.Errors) {
      err.Errors.forEach((e: any) => {
        if (e.FieldName) {
          if (
            e.FieldName.includes('.') &&
            e.FieldName.includes('[') &&
            e.FieldName.includes(']')
          ) {
            let fieldName = e.FieldName.split('.').at(-1);
            notifyError(get(i18n, fieldName, e.Message));
          } else {
            notifyError(get(i18n, e.FieldName, e.Message));
          }
        } else notifyError(get(i18n, e.Message, e.Message));
      });
      return;
    }
    if (err.message) {
      notifyError(get(i18n, err.message, err.message), 5000);
      return;
    }
  }
  let sError = JSON.stringify(err);
  notifyError(sError);
};

export const isArrayEqual = (x: Array<any>, y: Array<any>) => {
  return isEmpty(xorWith(x, y, isEqual));
};

export const formatDate = (
  date: number | Date | string | undefined,
  fmt = 'DD/MM/YYYY'
): string => {
  if (date) return dayjs(date).format(fmt).toLowerCase();
  return '';
};

export const formatDateMD = (
  date: number | Date | string,
  fmt = 'd-MMMM-yyyy'
): string => {
  if (date) return dayjs(date).format(fmt);
  return '';
};

export const formatDateLG = (
  date: number | Date | string,
  fmt = 'cccc, MMMM do, yyyy'
): string => {
  if (date) return dayjs(date).format(fmt);
  return '';
};

export const formatTime = (
  time: number | Date | string,
  fmt = 'h:mm a'
): string => {
  if (time) return dayjs(time).format(fmt);
  return '';
};
