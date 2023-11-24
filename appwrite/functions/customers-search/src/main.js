import { Client, Databases, Query } from 'node-appwrite';
import { getStaticFile, interpolate, throwIfMissing } from './utils.js';
import { MeiliSearch } from 'meilisearch';

export default async ({ req, res, log }) => {
  throwIfMissing(process.env, [
    'APPWRITE_API_KEY',
    'APPWRITE_DATABASE_ID',
    'APPWRITE_COLLECTION_ID',
    'MEILISEARCH_ENDPOINT',
    'MEILISEARCH_INDEX_NAME',
    'MEILISEARCH_ADMIN_API_KEY',
    'MEILISEARCH_SEARCH_API_KEY',
  ]);

  if (req.method === 'GET') {
    const html = interpolate(getStaticFile('index.html'), {
      MEILISEARCH_ENDPOINT: process.env.MEILISEARCH_ENDPOINT,
      MEILISEARCH_INDEX_NAME: process.env.MEILISEARCH_INDEX_NAME,
      MEILISEARCH_SEARCH_API_KEY: process.env.MEILISEARCH_SEARCH_API_KEY,
    });

    return res.send(html, 200, { 'Content-Type': 'text/html; charset=utf-8' });
  }

  const client = new Client()
    .setEndpoint(
      process.env.APPWRITE_ENDPOINT ?? 'https://app.do.inspiracode.com/v1'
    )
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  const meilisearch = new MeiliSearch({
    host: process.env.MEILISEARCH_ENDPOINT,
    apiKey: process.env.MEILISEARCH_ADMIN_API_KEY,
  });

  const index = meilisearch.index(process.env.MEILISEARCH_INDEX_NAME);

  let cursor = null;

  do {
    const queries = [Query.limit(100)];

    if (cursor) {
      queries.push(Query.cursorAfter(cursor));
    }

    const { documents } = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      queries
    );

    if (documents.length > 0) {
      cursor = documents[documents.length - 1].$id;
    } else {
      log(`No more documents found.`);
      cursor = null;
      break;
    }

    log(`Syncing chunk of ${documents.length} documents ...`);
    await index.addDocuments(documents, { primaryKey: '$id' });
  } while (cursor !== null);

  log('Sync finished.');

  return res.send('Sync finished.', 200);
};
