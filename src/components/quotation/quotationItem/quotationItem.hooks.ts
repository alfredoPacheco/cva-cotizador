import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { QuotationItemDto } from './quotationItem';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDebounce } from '@/core';

const QUERY_KEY = 'quotationItems';
const COLLECTION_ID = 'quotationItems';

export const useQuotationItemList = (enabled = true) => {
  const filtersForm = useForm(); // This form is to handle search and filters over list

  const debouncedSearch = useDebounce(filtersForm.watch('search'), 100);

  const query = useQuery<QuotationItemDto[]>({
    queryKey: [QUERY_KEY],
    enabled
  });

  useEffect(() => {
    query.refetch();
  }, [debouncedSearch]);

  return { query, filtersForm, debouncedSearch };
};

export const useQuotationItemSingle = (id: string, enabled = true) => {
  return useQuery<QuotationItemDto>({
    queryKey: [QUERY_KEY, id],
    enabled
  });
};

export const useQuotationItemCreate = () => {
  return useMutation({
    ...defaultCreateMutation({
      queryKey: [QUERY_KEY],
      collectionId: COLLECTION_ID,
      queryClient: useQueryClient(),
      appendMode: 'prepend'
    })
  });
};

export const useQuotationItemUpdate = () => {
  return useMutation({
    ...defaultUpdateMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};

export const useQuotationItemDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};
