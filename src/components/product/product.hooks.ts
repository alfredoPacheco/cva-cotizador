import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { ProductDto } from './product';
import { useForm } from 'react-hook-form';
import { Query } from 'appwrite';
import { useEffect } from 'react';
import { useDebounce } from '@/core';
import { omit } from 'lodash';
import type { ListQueryType } from '@/core/ReactQueryProvider/queryKeys';

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

  const query = useQuery<ProductDto[]>({
    queryKey: [
      QUERY_KEY,
      {
        queries: [
          Query.select([
            '$id',
            'brand',
            'listPrice',
            'distributorPrice',
            'name',
            'mediaMainImage'
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
  return useQuery<ProductDto>({
    queryKey: [QUERY_KEY, id],
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
