import { functions } from '@/core/appwriteClient';
import { Button, Chip } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';
import type { QuotationDto } from '../quotation/quotation';
import { useEffect } from 'react';

interface DollarResponse {
  dollar?: number;
  ok?: string;
}

const useDollar = () => {
  return useQuery<DollarResponse>({
    queryKey: ['dollar'],
    queryFn: async () => {
      const response = await functions.createExecution('dollar', '', false);
      const json = JSON.parse(response.responseBody);
      // console.log(json);
      return json;
    },
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    staleTime: 1000 * 60 * 4 // 4 minutes
  });
};

interface DollarProps {
  form: UseFormReturn<QuotationDto>;
}

const Dollar: React.FC<DollarProps> = ({ form }) => {
  const { data, isLoading, refetch } = useDollar();

  const quotationDollar = form.watch('dollar');

  const update = async () => {
    const response = await refetch();
    if (
      confirm(`Confirma actualizar el dollar de TVC a ${response.data.dollar}?`)
    ) {
      form.setValue('dollar', response.data.dollar, { shouldDirty: true });
    }
  };

  useEffect(() => {
    if (!quotationDollar) {
      form.setValue('dollar', data?.dollar, { shouldDirty: true });
    }
  }, [quotationDollar, data]);

  const notSaved = !quotationDollar || form.formState.dirtyFields.dollar;
  const dollarChanged = quotationDollar > 0 && quotationDollar !== data?.dollar;

  if (isLoading) return <span>Cargando...</span>;

  return (
    <div className="flex flex-row items-center justify-end flex-1 gap-2">
      <label>Dollar TVC:</label>
      <Chip
        style={{ minWidth: 60 }}
        color={notSaved ? 'danger' : dollarChanged ? 'warning' : 'success'}
      >
        ${quotationDollar || data?.dollar}
      </Chip>
      {notSaved && <span>No guardado</span>}
      {dollarChanged && (
        <Button onPress={update} variant="light">
          El dollar ha cambiado
        </Button>
      )}
    </div>
  );
};

export default Dollar;
