import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { QuotationDto } from './quotation';
import { useForm } from 'react-hook-form';
import { Query, type Models } from 'appwrite';
import { useEffect } from 'react';
import { useDebounce } from '@/core';
import { get, omit } from 'lodash';
import type { ListQueryType } from '@/core/ReactQueryProvider/queryKeys';
import { databases, functions, storage } from '@/core/appwriteClient';
import dayjs from 'dayjs';
import { DEFAULT_DATABASE_ID } from '@/core/ReactQueryProvider/defaultQueries';

const QUERY_KEY = 'quotations';
const COLLECTION_ID = 'quotations';

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

export const useQuotationList = (enabled = true) => {
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

  const query = useQuery<QuotationDto[]>({
    queryKey: [
      QUERY_KEY,
      {
        queries: [
          Query.select([
            '$id',
            'title',
            'quotationNumber',
            'sentAt',
            'validUntil',
            'quotationDate'
          ]),
          Query.orderDesc('$createdAt')
        ]
      } as ListQueryType
    ],
    enabled
  });

  useEffect(() => {
    query.refetch();
  }, [debouncedSearch]);

  return { query, filtersForm, debouncedSearch };
};

export const useQuotationSingle = (id: string, enabled = true) => {
  return useQuery<QuotationDto>({
    queryKey: [QUERY_KEY, id],
    enabled
  });
};

export const useQuotationCreate = () => {
  return useMutation({
    ...defaultCreateMutation({
      queryKey: [QUERY_KEY],
      collectionId: COLLECTION_ID,
      queryClient: useQueryClient(),
      appendMode: 'prepend'
    })
  });
};

export const useQuotationUpdate = () => {
  return useMutation({
    ...defaultUpdateMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};

export const useQuotationDelete = () => {
  return useMutation({
    ...defaultDeleteMutation([QUERY_KEY], useQueryClient(), COLLECTION_ID)
  });
};

export const generateQuotationPDF = async id => {
  if (!id) throw new Error('id is required');
  const quotation = await databases.getDocument(
    import.meta.env.PUBLIC_APPWRITE_DATABASE!,
    COLLECTION_ID,
    id
  );
  const payload = JSON.stringify(quotation);
  const resp = await functions.createExecution(
    'reports',
    payload,
    false,
    `/?report=cva/cotizador/cva-cotizacion-template.pptx`,
    'POST'
  );
  const json = JSON.parse(resp.responseBody);

  return json as Models.File;
};

export const useQuotationPDF = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      return await generateQuotationPDF(id);
    }
  });
};

export const generateQuotationNumber = async () => {
  const date = dayjs().format('YYMMDD');
  const lastFromDb = await databases.listDocuments(
    DEFAULT_DATABASE_ID,
    COLLECTION_ID,
    [
      Query.limit(1),
      Query.orderDesc('$createdAt'),
      Query.orderDesc('quotationNumber')
    ]
  );
  const lastNumber =
    get(lastFromDb, 'documents[0].quotationNumber', '000') || '000';
  const lastThree = lastNumber.slice(-3);
  const nextSequence = Number(lastThree) + 1;
  const quotationNumber = `${date}${nextSequence.toString().padStart(3, '0')}`;
  return quotationNumber;
};
