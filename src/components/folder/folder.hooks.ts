import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  DEFAULT_DATABASE_ID
} from '@/core/ReactQueryProvider/defaultMutations';
import type { FolderDto } from './folder';
import { useForm } from 'react-hook-form';
import { useAuth, useDebounce } from '@/core';
import { Query } from 'appwrite';
import type { ListQueryType } from '@/core/ReactQueryProvider/queryKeys';
import { databases } from '@/core/appwriteClient';
import { QUOTATIONS_COLLECTION_ID } from '../quotation/quotation.hooks';
import dayjs from 'dayjs';
import { authCentralState } from '@/core/AuthCentralService';

const COLLECTION_ID = 'folders';
const QUERY_KEY = COLLECTION_ID;

export const useFolderList = (enabled = true) => {
  const { auth } = useAuth();
  const filtersForm = useForm(); // This form is to handle search and filters over list

  const debouncedSearch = useDebounce(filtersForm.watch('search'), 200);

  const query = useQuery<FolderDto[]>({
    queryKey: [
      QUERY_KEY,
      { limit: 5000, queries: [Query.orderDesc('name')] } as ListQueryType,
      debouncedSearch,
      auth?.userId
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
    enabled: !!name && name !== 'no-folder'
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
    mutationFn: async (id: string) => {
      if (!id)
        throw new Error('No se puede eliminar la carpeta. El id es requerido');

      if (id == 'no-folder')
        throw new Error('No se puede eliminar la carpeta "no-folder"');

      const quotationsInFolder = await databases.listDocuments(
        DEFAULT_DATABASE_ID,
        QUOTATIONS_COLLECTION_ID,
        [Query.equal('folder', id), Query.isNull('deletedAt'), Query.limit(1)]
      );

      if (quotationsInFolder.documents.length > 0) {
        throw new Error(
          'No se puede eliminar la carpeta porque tiene cotizaciones'
        );
      }

      return databases.updateDocument(DEFAULT_DATABASE_ID, COLLECTION_ID, id, {
        deletedAt: dayjs().toISOString(),
        deletedBy: authCentralState.account.value?.email
      });
    }
  });
};
