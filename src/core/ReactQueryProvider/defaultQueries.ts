import { type QueryFunction } from '@tanstack/react-query';
import get from 'lodash/get';

export const defaultQueryFn: QueryFunction = async ({
  meta,
  queryKey,
  signal
}) => {
  console.log('meta', meta);
  console.log('queryKey', queryKey);
  console.log('signal', signal);

  const resource = get(queryKey, '[0]') as string | undefined;
  console.log('resource', resource);

  if (resource === undefined) return [];

  const paginate = {
    page: 1,
    limit: 10
  };

  const search = {};

  return [];
  //   return mockCarriers(100);

  // return databases.listDocuments('ultratrace-db', resource);
};
