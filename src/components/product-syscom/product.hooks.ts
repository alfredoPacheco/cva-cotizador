import { useQuery } from '@tanstack/react-query';
import type { SyscomProductDto } from './product';
import { useForm } from 'react-hook-form';
import { Query } from 'appwrite';
import { useDebounce } from '@/core';
import type { ListQueryType } from '@/core/ReactQueryProvider/queryKeys';

const QUERY_KEY = 'products-syscom';

const DATABASE_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_SYSCOM!;

export const useSyscomProductList = (enabled = true) => {
  const filtersForm = useForm(); // This form is to handle search and filters over list

  const debouncedSearch = useDebounce(filtersForm.watch('search'), 100);
  const query = useQuery<SyscomProductDto[]>({
    queryKey: [
      QUERY_KEY,
      {
        limit: 99999999,
        queries: [
          Query.select([
            '$id',
            'name',
            'model',
            'priceList',
            'priceOne', // Verify if this is distribuitor price
            'brand',
            'brandId',
            'imgMain'
          ])
        ]
      } as ListQueryType
    ],
    enabled,
    meta: {
      DATABASE_ID
    }
  });

  return { query, filtersForm, debouncedSearch };
};

// export const useProductImages = (id: string, enabled = true) => {
//   return useQuery<string[]>({
//     queryKey: [QUERY_KEY, id, 'images'],
//     queryFn: async () => {
//       const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
//         Query.equal('$id', id),
//         Query.select([
//           '$id',
//           'name',
//           'model',
//           'priceList',
//           'priceOne', // Verify if this is distribuitor price
//           'brand',
//           'brandId',
//           'imgMain'
//         ])
//       ]);

//       const result = [];
//       const firstItem = get(res.documents, '[0]');

//       const mainImage = get(firstItem, 'mediaMainImage');
//       if (mainImage) result.push(mainImage);

//       const images = get(firstItem, 'mediaGallery', []);
//       result.push(...images);

//       // console.log('useProductImages result', result);

//       return result;
//     },
//     enabled: enabled && !!id
//   });
// };
