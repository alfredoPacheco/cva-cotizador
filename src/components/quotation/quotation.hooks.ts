import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultCreateMutation,
  defaultUpdateMutation,
  defaultDeleteMutation
} from '@/core/ReactQueryProvider/defaultMutations';
import type { QuotationDto } from './quotation';
import { useForm } from 'react-hook-form';
import { Query, type Models } from 'appwrite';
import { useDebounce } from '@/core';
import { get } from 'lodash';
import type { ListQueryType } from '@/core/ReactQueryProvider/queryKeys';
import { databases, functions } from '@/core/appwriteClient';
import dayjs from 'dayjs';
import { DEFAULT_DATABASE_ID } from '@/core/ReactQueryProvider/defaultQueries';
import type { ContactDto } from '@/types';
import { formatCurrency } from '@/core/utils';

const QUERY_KEY = 'quotations';
const COLLECTION_ID = 'quotations';

export const useQuotationList = (enabled = true) => {
  const filtersForm = useForm(); // This form is to handle search and filters over list

  const debouncedSearch = useDebounce(filtersForm.watch('search'), 100);

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

  quotation.d = dayjs(quotation.quotationDate).format('DD');
  quotation.m = dayjs(quotation.quotationDate).format('MM');
  quotation.y = dayjs(quotation.quotationDate).format('YYYY');

  quotation.sub = formatCurrency(quotation.subtotalMxn);
  quotation.iva = formatCurrency(quotation.ivaMxn);
  quotation.tot = formatCurrency(quotation.totalMxn);

  quotation.num = quotation.quotationNumber;

  quotation.sections = [];
  if (quotation.scope) {
    quotation.sections.push({
      title: 'Alcance del servicio',
      content: quotation.scope
    });
  }
  if (quotation.exclusions) {
    quotation.sections.push({
      title: 'Exclusiones',
      content: quotation.exclusions
    });
  }

  if (quotation.paymentConditions) {
    quotation.sections.push({
      title: 'Terminos y condiciones de pago',
      content: quotation.paymentConditions
    });
  }
  if (quotation.capacitation) {
    quotation.sections.push({
      title: 'Capacitación',
      content: quotation.capacitation
    });
  }
  if (quotation.warranty) {
    quotation.sections.push({
      title: 'Garantías',
      content: quotation.warranty
    });
  }
  if (quotation.observations) {
    quotation.sections.push({
      title: 'Observaciones y comentarios adicionales',
      content: quotation.observations
    });
  }

  quotation.cur = quotation.currency;

  quotation.its = quotation.items.map(item => {
    return {
      ...item,
      s: item.sequence,
      qty: item.quantity,
      prc: formatCurrency(item.unitPriceMxn),
      amt: formatCurrency(item.amountMxn)
    };
  });

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

export const useQuotationsByCustomer = (customerId: string) => {
  return useQuery<QuotationDto[]>({
    queryKey: [
      QUERY_KEY,
      {
        queries: [
          Query.select(['$id', 'title', 'quotationNumber', 'quotationDate']),
          Query.equal('customerId', customerId),
          Query.orderDesc('$createdAt')
        ]
      } as ListQueryType
    ],
    enabled: !!customerId
  });
};

export const parseContacts = (data: string[] | ContactDto[]): ContactDto[] => {
  return (
    data.map(s => {
      if (typeof s === 'string') {
        try {
          const json = JSON.parse(s);
          return json;
        } catch (e) {
          return s;
        }
      }
      return s;
    }) || []
  );
};

export const useQuotationSuscribers = (id: string) => {
  return useQuery<ContactDto[]>({
    queryKey: [QUERY_KEY, 'suscribers', id],
    queryFn: async () => {
      const quotation = await databases.getDocument(
        DEFAULT_DATABASE_ID,
        COLLECTION_ID,
        id
      );
      const suscribers = quotation.suscribers || [];
      return parseContacts(suscribers);
    },
    enabled: !!id
  });
};

export const useUpdateSuscribers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      $id,
      suscribers
    }: {
      $id: string;
      suscribers: ContactDto[];
    }) => {
      const parsedSuscribers = suscribers.map(suscriber => {
        return JSON.stringify(suscriber);
      });
      const updated = await databases.updateDocument(
        DEFAULT_DATABASE_ID,
        COLLECTION_ID,
        $id,
        { suscribers: parsedSuscribers }
      );

      // console.log('updated', updated);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'suscribers'] });

      return updated;
    }
  });
};
