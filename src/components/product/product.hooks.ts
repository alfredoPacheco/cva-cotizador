import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { TVCProductDto } from './product';
import { Query } from 'appwrite';
import { get } from 'lodash';
import type { ListQueryType } from '@/core/ReactQueryProvider/queryKeys';
import { databases } from '@/core/appwriteClient';

const QUERY_KEY = 'products';
const COLLECTION_ID = 'products';

const DATABASE_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_TVC!;

export const useProductList = (enabled = true) => {
  const query = useQuery<TVCProductDto[]>({
    queryKey: [
      QUERY_KEY,
      {
        limit: 99999999,
        queries: [
          Query.select([
            '$id',
            'name',
            'tvcModel',
            'listPrice',
            'distributorPrice',
            'brand',
            'mediaMainImage',
            'category',
            'providerModel'
          ])
        ]
      } as ListQueryType
    ],
    enabled,
    meta: {
      DATABASE_ID
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    gcTime: 1000 * 60 * 60 * 24 * 3 // 3 days
  });

  return { query };
};

export const useProductImages = (id: string, enabled = true) => {
  return useQuery<string[]>({
    queryKey: [QUERY_KEY, id, 'images'],
    queryFn: async () => {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('$id', id),
        Query.select([
          '$id',
          'name',
          'tvcModel',
          'listPrice',
          'distributorPrice',
          'brand',
          'mediaMainImage',
          'category',
          'providerModel',
          'mediaGallery'
        ])
      ]);

      const result = [];
      const firstItem = get(res.documents, '[0]');

      const mainImage = get(firstItem, 'mediaMainImage');
      if (mainImage) result.push(mainImage);

      const images = get(firstItem, 'mediaGallery', []);
      result.push(...images);

      return result;
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    gcTime: 1000 * 60 * 60 * 24 * 3 // 3 days
  });
};

export const useProductCreate = () => {
  return useMutation({
    ...defaultCreateMutation({
      queryKey: [QUERY_KEY],
      collectionId: COLLECTION_ID,
      queryClient: useQueryClient(),
      appendMode: 'prepend'
    })
  });
};

export const useProductUpdate = () => {
  return useMutation({
    ...defaultUpdateMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};

export const useProductDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};
