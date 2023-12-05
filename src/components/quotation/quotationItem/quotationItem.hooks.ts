import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { QuotationItemDto } from './quotationItem';

const QUERY_KEY = 'quotationItems';
const COLLECTION_ID = 'quotationItems';

export const useQuotationItemList = (quotationId, enabled = true) => {
  const query = useQuery<QuotationItemDto[]>({
    queryKey: [QUERY_KEY, { params: { quotation: quotationId } }],
    enabled: enabled && !!quotationId
  });

  return { query };
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
      appendMode: 'append'
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
