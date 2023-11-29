import { Field, ReadonlyField, TextInput } from '@/ui/Inputs';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Divider } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import {
  useQuotationCreate,
  useQuotationDelete,
  useQuotationSingle,
  useQuotationUpdate
} from './quotation.hooks';
import type { QuotationDto } from './quotation';
import { FormButton } from '@/ui/Buttons';
import { GiSaveArrow } from 'react-icons/gi';
import { PiTrashBold } from 'react-icons/pi';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';
import { useCustomerList } from '../customer/customer.hooks';
import { Avatar } from '@nextui-org/react';
import QuotationItemsList from './quotationItem/QuotationItemsList';

const FormField = ({ label, name, control, rows = 0, ...props }) => {
  return (
    <Field label={label}>
      <TextInput
        control={control}
        name={name}
        variant="underlined"
        rows={rows}
        classNames={{
          inputWrapper: ['!px-0']
        }}
        {...props}
      />
    </Field>
  );
};

const ReadonlyFormField = ({
  label,
  name,
  control,
  labelSize = 'sm',
  prefix = '',
  minWidth = 30,
  ...props
}) => {
  return (
    <Field label={label} size={labelSize} style={{ minWidth }}>
      <div className={`flex flex-row items-center text-${props.fontSize}`}>
        {prefix}
        <ReadonlyField control={control} name={name} {...props} />
      </div>
    </Field>
  );
};

interface QuotationFormProps {
  id: string;
  dialog?: DialogWidget;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ id, dialog }) => {
  const { success, error } = useNotifications();
  const { data } = useQuotationSingle(id, id !== 'new');
  const { control, handleSubmit, getValues } = useForm<QuotationDto>({
    values: data
  });

  const {
    query: { data: customers }
  } = useCustomerList();

  console.log('customers', customers);

  const createQuotation = useQuotationCreate();
  const saveQuotation = useQuotationUpdate();
  const removeQuotation = useQuotationDelete();

  const onSubmit = handleSubmit(async (data: QuotationDto) => {
    try {
      await saveQuotation.mutateAsync(data);
      success('Registro actualizado.');
    } catch (err) {
      handleErrors(err, error);
    }
  });
  const onRemove = async () => {
    try {
      if (confirm('¿Estás seguro de eliminar este registro?') === false) return;
      await removeQuotation.mutateAsync(id);
      success('Registro eliminado.');
    } catch (err) {
      handleErrors(err, error);
    }
  };

  const onCreate = async (s: string) => {
    try {
      const data = getValues();
      await createQuotation.mutateAsync(data);
      success('Registro creado.');
      dialog?.close();
    } catch (err) {
      handleErrors(err, error);
    }
  };

  if (dialog) {
    dialog.onOk = onCreate;
  }
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div className="flex flex-row justify-between">
        <ReadonlyFormField
          control={control}
          name="createdBy"
          label="Realizado pr:"
          readOnly
        />
        <Field label="Cliente">cliente</Field>
        <div
          className="flex flex-grow flex-row items-center justify-center gap-1"
          style={{ maxWidth: 200 }}
        >
          <FormButton onPress={onRemove}>Borrar</FormButton>
          <Divider orientation="vertical" className="h-5" />
          <FormButton type="submit">Guardar</FormButton>
        </div>
      </div>
      <QuotationItemsList quotationId={id} />
      <pre>{JSON.stringify(data, null, 1)}</pre>
      <FormField control={control} name="scope" label="Alcance del trabajo" />
      <FormField control={control} name="exclusions" label="Exclusiones" />
      <FormField
        control={control}
        name="observations"
        label="Observaciones"
        rows={1}
      />
      <FormField
        control={control}
        name="paymentConditions"
        label="Condiciones de pago"
      />

      <FormField control={control} name="capacitation" label="Capacitación" />

      <div className="flex flex-row justify-between bg-default-200 rounded-lg p-8">
        <div className="flex flex-col gap-2">
          <ReadonlyFormField
            control={control}
            name="subtotal"
            label="Subtotal"
            labelSize="2xl"
            fontSize="2xl"
            prefix="$"
          />
        </div>
        <Divider orientation="vertical" className="h-14" />
        <div className="flex flex-col gap-2">
          <ReadonlyFormField
            control={control}
            name="iva"
            label="Subtotal"
            labelSize="2xl"
            fontSize="2xl"
            prefix="$"
          />
        </div>
        <Divider orientation="vertical" className="h-14" />
        <div className="flex flex-col gap-2">
          <ReadonlyFormField
            control={control}
            name="total"
            label="Subtotal"
            labelSize="2xl"
            fontSize="2xl"
            prefix="$"
          />
        </div>
      </div>
    </form>
  );
};

export default QuotationForm;
