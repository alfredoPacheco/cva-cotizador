import { functions } from '@/core/appwriteClient';
import { formatCurrency } from '@/core/utils';
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
    queryKey: ['dollar-syscom'],
    queryFn: async () => {
      const response = await functions.createExecution(
        'syscom-dollar',
        '',
        false
      );
      const json = JSON.parse(response.responseBody);
      // console.log(json);
      json.dollar = Number(json.dollar);
      return json;
    },
    refetchInterval: 1000 * 60 * 5
  });
};

interface DollarProps {
  form: UseFormReturn<QuotationDto>;
}

const DollarSyscom: React.FC<DollarProps> = ({ form }) => {
  const { data, isLoading, refetch } = useDollar();

  const quotationDollar = form.watch('dollarSyscom');

  const update = async () => {
    const response = await refetch();
    if (
      confirm(
        `Confirma actualizar el dollar de Syscom a ${response.data.dollar}?`
      )
    ) {
      form.setValue('dollarSyscom', response.data.dollar, {
        shouldDirty: true
      });
    }
  };

  useEffect(() => {
    if (!quotationDollar) {
      form.setValue('dollarSyscom', data?.dollar, { shouldDirty: true });
    }
  }, [quotationDollar, data]);

  const notSaved = !quotationDollar || form.formState.dirtyFields.dollarSyscom;
  const dollarChanged = quotationDollar > 0 && quotationDollar !== data?.dollar;

  if (isLoading) return <span>Cargando...</span>;

  return (
    <div className="flex flex-row items-center justify-end flex-1 gap-2">
      <label>Dollar Syscom:</label>
      <Chip
        style={{ minWidth: 60 }}
        color={notSaved ? 'danger' : dollarChanged ? 'warning' : 'success'}
      >
        ${quotationDollar || data?.dollar}
      </Chip>
      {notSaved && <span>No guardado</span>}
      {dollarChanged && (
        <span>
          El dollar ha cambiado <Button onPress={update}>Actualizar</Button>
        </span>
      )}
    </div>
  );
};

export default DollarSyscom;
