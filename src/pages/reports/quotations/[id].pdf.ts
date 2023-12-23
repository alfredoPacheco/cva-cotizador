import { databases } from '@/core/appwriteClient';
import { Query } from 'appwrite';

export const prerender = false;

export async function GET({ params, request }) {
  const { id } = params;
  try {
    const quotation = await databases.getDocument(
      'quotations-db',
      'quotations',
      id,
      [Query.select(['reportUrl'])]
    );

    if (!quotation.reportUrl)
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });

    const response = await fetch(
      new URL(quotation.reportUrl, import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
        .href
    );
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
