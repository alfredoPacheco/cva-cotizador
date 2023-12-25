import { databases, storage } from '@/core/appwriteClient';
import { Query } from 'appwrite';

export const prerender = false;

export async function GET({ params }) {
  const { id } = params;
  try {
    const quotation = await databases.getDocument(
      'quotations-db',
      'quotations',
      id,
      [Query.select(['reportId'])]
    );

    if (!quotation.reportId)
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });

    const file = storage.getFileView('reports', quotation.reportId);

    const response = await fetch(file.href);

    return new Response(await response.arrayBuffer());
  } catch (e) {
    if (e.code === 404) {
      console.log(JSON.stringify(e, null, 2));
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });
    }
    return new Response(null, { status: 404 });
  }
}
