import { type QueryFunction } from '@tanstack/react-query';
import { isString } from 'lodash';
import get from 'lodash/get';
import { databases } from '../appwriteClient';
import { Query } from 'appwrite';

export const defaultQueryFn: QueryFunction = async ({
  queryKey,
  meta,
  signal
}) => {
  const collectionId = get(queryKey, '[0]');
  if (!collectionId) {
    return { documents: [] };
  }

  const documentId = get(queryKey, '[1]');
  if (isString(documentId)) {
    const res = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      collectionId,
      documentId
    );

    return res;
  }

  const params = get(queryKey, '[1]');
  const queries: string[] = [];
  if (params) {
    const limit = get(params, 'limit');
    const page = get(params, 'page');
    if (limit && page) {
      queries.push(Query.limit(limit));
      queries.push(Query.offset((page - 1) * limit));
    }
  }

  const res = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    collectionId,
    queries
  );

  return res;
};
