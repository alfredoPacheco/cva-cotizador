import { type QueryFunction } from '@tanstack/react-query';
import { isString } from 'lodash';
import get from 'lodash/get';
import { databases } from '../appwriteClient';
import { Query } from 'appwrite';
import type { QueryKey } from './queryKeys';

export const defaultQueryFn: QueryFunction = async ({
  queryKey,
  meta,
  signal
}) => {
  const collectionId = get(queryKey, '[0]');
  if (!collectionId) {
    return { documents: [] };
  }

  const queryType = get(queryKey, '[1]') as QueryKey;

  if (queryType.type === 'single') {
    const res = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      collectionId,
      queryType.id
    );

    return res;
  }

  if (queryType.type === 'list') {
    const limit = get(queryType, 'limit', 1000);
    const page = get(queryType, 'page', 1);

    const queries: string[] = [];
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));

    const params = get(queryType, 'params', {});
    Object.keys(params).forEach(key => {
      const value = params[key];
      queries.push(Query.equal(key, value));
    });

    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      collectionId,
      queries
    );

    return res;
  }
};
