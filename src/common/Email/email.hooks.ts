import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { EmailDto } from './email';

const QUERY_KEY = 'emails';
const COLLECTION_ID = 'emails';

export const useEmailSingle = (id: string, enabled = true) => {
  return useQuery<EmailDto>({
    queryKey: [QUERY_KEY, id],
    enabled
  });
};

export const useEmailCreate = () => {
  return useMutation({
    ...defaultCreateMutation({
      queryKey: [QUERY_KEY],
      collectionId: COLLECTION_ID,
      queryClient: useQueryClient(),
      appendMode: 'prepend'
    })
  });
};

export const useEmailUpdate = () => {
  return useMutation({
    ...defaultUpdateMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};
