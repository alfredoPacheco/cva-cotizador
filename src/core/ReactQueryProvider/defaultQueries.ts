import { type QueryFunction } from '@tanstack/react-query';
import get from 'lodash/get';
import { databases } from '../appwriteClient';
import { Query } from 'appwrite';
import type { QueryType } from './queryKeys';

const DATABASE_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE!;

export const defaultQueryFn: QueryFunction = async ({
  queryKey,
  meta,
  signal
}) => {
  const collectionId = get(queryKey, '[0]');
  if (!collectionId) {
    return { documents: [] };
  }

  const secondElement = get(queryKey, '[1]');
  if (!secondElement) {
    return { documents: [] };
  }

  const queryType = secondElement as QueryType;

  if (queryType.type === 'single') {
    const res = await databases.getDocument(
      DATABASE_ID,
      collectionId,
      queryType.id
    );

    return res;
  }

  // QueryType is list:
  const limit = get(queryType, 'limit', 1000);
  const page = get(queryType, 'page', 1);

  const queries: string[] = [];
  queries.push(Query.limit(limit));
  queries.push(Query.offset((page - 1) * limit));

  const params = get(queryType, 'params', {});
  Object.keys(params).forEach(key => {
    queries.push(Query.equal(key, params[key]));
  });

  const res = await databases.listDocuments(DATABASE_ID, collectionId, queries);

  return res;
};
