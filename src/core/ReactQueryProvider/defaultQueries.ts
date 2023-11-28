import { type QueryFunction } from '@tanstack/react-query';
import get from 'lodash/get';
import { databases } from '../appwriteClient';
import { Query } from 'appwrite';
import type { QueryType } from './queryKeys';

const DATABASE_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE!;

export const defaultQueryFn: QueryFunction<unknown, QueryType> = async ({
  queryKey,
  meta,
  signal
}) => {
  const collectionId = get(queryKey, '[0]');
  if (!collectionId) {
    return { documents: [] };
  }

  const byIdQuery = queryKey[1];

  if (typeof byIdQuery === 'string') {
    const res = await databases.getDocument(
      DATABASE_ID,
      collectionId,
      byIdQuery
    );

    return res;
  }

  const listQuery = queryKey[1];

  // QueryType is list:
  const limit = get(listQuery, 'limit', 1000);
  const page = get(listQuery, 'page', 1);

  const allQueries: string[] = [];
  const queries = get(listQuery, 'queries', []);
  allQueries.push(...queries);

  allQueries.push(Query.limit(limit));
  allQueries.push(Query.offset((page - 1) * limit));

  const params = get(listQuery, 'params', {});
  Object.keys(params).forEach(key => {
    allQueries.push(Query.equal(key, params[key]));
  });

  console.log('allQueries', allQueries);

  const res = await databases.listDocuments(
    DATABASE_ID,
    collectionId,
    allQueries
  );

  return res?.documents || [];
};
