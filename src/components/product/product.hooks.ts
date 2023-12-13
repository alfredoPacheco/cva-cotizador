import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { TVCProductDto } from './product';
import { useForm } from 'react-hook-form';
import { Query } from 'appwrite';
import { useDebounce } from '@/core';
import { get, omit } from 'lodash';
import type { ListQueryType } from '@/core/ReactQueryProvider/queryKeys';
import { databases } from '@/core/appwriteClient';

const QUERY_KEY = 'products';
const COLLECTION_ID = 'products';

const DATABASE_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_TVC!;

function getSearchQuery(searchValue: string, sample: any) {
  const result: string[] = [];
  if (!searchValue || searchValue.trim() === '') return result;

  // const sample: T = {} as T;
  const entity = omit(sample, [
    '$id',
    '$collectionId',
    '$createdAt',
    '$databaseId',
    '$permissions',
    '$updatedAt'
  ]);
  // console.log('sample', sample);
  // console.log('entity', entity);
  Object.keys(entity).forEach(prop => {
    if (typeof sample[prop] === 'string') {
      result.push(Query.search(prop, searchValue));
    }
  });
  return result;
}

export const useProductList = (enabled = true) => {
  const filtersForm = useForm(); // This form is to handle search and filters over list

  const debouncedSearch = useDebounce(filtersForm.watch('search'), 100);
  // const [searchQuery, setSearchQuery] = useState<Query[]>([]);

  // useEffect(() => {
  //   const newSearch = getSearchQuery(debouncedSearch, {
  //     name: ''
  //     // email: '',
  //     // phone: '',
  //     // address: '',
  //     // businessName: '',
  //     // taxRegime: ''
  //   });
  //   console.log('newSearch', newSearch);
  //   // setSearchQuery(newSearch);
  // }, [debouncedSearch]);

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
    }
  });

  // useEffect(() => {
  //   query.refetch();
  // }, [debouncedSearch]);

  return { query, filtersForm, debouncedSearch };
};

export const useProductSingle = (id: string, enabled = true) => {
  return useQuery<TVCProductDto>({
    queryKey: [QUERY_KEY, id],
    enabled
  });
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

      // console.log('useProductImages result', result);

      return result;
    },
    enabled
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
