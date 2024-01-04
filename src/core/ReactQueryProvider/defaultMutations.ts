import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { ID, databases } from '../appwriteClient';
import omit from 'lodash/omit';

export const DEFAULT_DATABASE_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE!;

export interface BaseDto {
  $id: string;
}

interface defaultCreateMutationProps {
  queryKey: QueryKey;
  collectionId?: string;
  queryClient: QueryClient;
  appendMode?: 'none' | 'append' | 'prepend';
}
export function defaultCreateMutation<T extends BaseDto>({
  queryKey,
  collectionId,
  queryClient,
  appendMode = 'append'
}: defaultCreateMutationProps) {
  return {
    mutationFn: async (data: T) => {
      if (!collectionId) throw new Error('collectionId is required');
      const payload = omit(data, [
        '$id',
        '$collectionId',
        '$createdAt',
        '$databaseId',
        '$permissions',
        '$updatedAt'
      ]);
      return await databases.createDocument(
        DEFAULT_DATABASE_ID,
        collectionId,
        ID.unique(),
        payload
      );
    },
    onMutate: async (data: T) => {
      if (!data.$id) {
        console.error('data.$id is required for optimistic updates');
        throw new Error('data.$id is required for optimistic updates');
      }
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient?.getQueryData(queryKey);

      // Optimistically update to the new value
      if (previousData) {
        if (appendMode === 'append') {
          queryClient.setQueryData(queryKey, (old: any) => [...old, data]);
        }
        if (appendMode === 'prepend') {
          queryClient.setQueryData(queryKey, (old: any) => [data, ...old]);
        }
      } else {
        queryClient.setQueryData(queryKey, [data]);
      }

      // Return a context object with the snapshotted value
      return { previousData };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newData, context) => {
      queryClient.setQueryData(queryKey, context.previousData);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  };
}

export function defaultUpdateMutation<T extends BaseDto>(
  queryKey,
  queryClient: QueryClient,
  collectionId?: string
) {
  return {
    mutationFn: async (data: T) => {
      if (!collectionId) throw new Error('collectionId is required');
      const payload = omit(data, [
        '$id',
        '$collectionId',
        '$createdAt',
        '$databaseId',
        '$permissions',
        '$updatedAt'
      ]);
      return await databases.updateDocument(
        DEFAULT_DATABASE_ID,
        collectionId,
        data.$id,
        payload
      );
    },
    onMutate: async (data: T) => {
      if (!data.$id) {
        console.error('data.$id is required for optimistic updates');
        throw new Error('data.$id is required for optimistic updates');
      }
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey) as T[];

      const updatedData = previousData?.map((item: T) => {
        if (item.$id === data.$id) {
          return data;
        }
        return item;
      });

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, updatedData);

      // Return a context object with the snapshotted value
      return { previousData };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newData, context) => {
      queryClient.setQueryData(queryKey, context.previousData);
    },
    // Always refetch after error or success:
    onSettled: (_, error) => {
      if (error) return;
      queryClient.invalidateQueries({ queryKey });
    }
  };
}

export function defaultDeleteMutation<T extends BaseDto>(
  queryKey,
  queryClient: QueryClient,
  collectionId?: string
) {
  return {
    mutationFn: async (id: string) => {
      if (!collectionId) throw new Error('collectionId is required');
      return await databases.deleteDocument(
        DEFAULT_DATABASE_ID,
        collectionId,
        id
      );
    },
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey) as T[];

      const filteredData = previousData?.filter((item: T) => item.$id !== id);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, filteredData);

      // Return a context object with the snapshotted value
      return { previousData };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newData, context) => {
      queryClient.setQueryData(queryKey, context.previousData);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  };
}
