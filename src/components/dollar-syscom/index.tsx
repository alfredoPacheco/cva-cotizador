import { Button, Chip } from '@nextui-org/react';
import type { UseFormReturn } from 'react-hook-form';
import type { QuotationDto } from '../quotation/quotation';
import { useEffect } from 'react';
import { useDollar } from './dollar.hooks';

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
        <Button onPress={update} variant="light">
          El dollar ha cambiado
        </Button>
      )}
    </div>
  );
};

export default DollarSyscom;
