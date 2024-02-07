import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { FolderDto } from './folder';
import { useForm } from 'react-hook-form';
import { useDebounce } from '@/core';
import { Query } from 'appwrite';
import type { ListQueryType } from '@/core/ReactQueryProvider/queryKeys';

const COLLECTION_ID = 'folders';
const QUERY_KEY = COLLECTION_ID;

export const useFolderList = (enabled = true) => {
  const filtersForm = useForm(); // This form is to handle search and filters over list

  const debouncedSearch = useDebounce(filtersForm.watch('search'), 200);

  const query = useQuery<FolderDto[]>({
    queryKey: [
      QUERY_KEY,
      { limit: 5000, queries: [Query.orderDesc('name')] } as ListQueryType,
      debouncedSearch
    ],
    enabled,
    placeholderData: keepPreviousData
  });

  return { query, filtersForm, debouncedSearch };
};

export const useFolderSingle = (id: string, enabled = true) => {
  return useQuery<FolderDto>({
    queryKey: [QUERY_KEY, id],
    enabled
  });
};

export const useFolderByName = (name: string) => {
  return useQuery<FolderDto[]>({
    queryKey: [
      QUERY_KEY,
      {
        params: { name },
        queries: [Query.select(['$id', 'name'])]
      } as ListQueryType
    ],
    enabled: !!name
  });
};

export const useFolderCreate = () => {
  return useMutation({
    ...defaultCreateMutation({
      queryKey: [QUERY_KEY],
      collectionId: COLLECTION_ID,
      queryClient: useQueryClient(),
      appendMode: 'prepend'
    })
  });
};

export const useFolderUpdate = () => {
  return useMutation({
    ...defaultUpdateMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};

export const useFolderDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};
