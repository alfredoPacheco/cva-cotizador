import { Field, ReadonlyField, TextInput } from '@/ui/Inputs';
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
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';
import QuotationItemsList from './quotationItem/QuotationItemsList';

const FormField = ({ label, name, control, rows = 2, ...props }) => {
  return (
    <Field label={label}>
      <TextInput
        control={control}
        name={name}
        rows={rows}
        {...props}
        variant="underlined"
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
  const { data, refetch } = useQuotationSingle(id, id !== 'new');
  const form = useForm<QuotationDto>({
    values: data
  });

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { isValid, isDirty }
  } = form;

  // const {
  //   query: { data: customers }
  // } = useCustomerList();

  // console.log('customers', customers);

  const createQuotation = useQuotationCreate();
  const saveQuotation = useQuotationUpdate();
  const removeQuotation = useQuotationDelete();

  const onSubmit = handleSubmit(async (data: QuotationDto) => {
    try {
      // console.log({ isValid, isDirty });
      // console.log('dirtyFields', form.formState.dirtyFields);
      // console.log('data', data);
      // return;
      if (!isValid) return console.log('not valid');
      if (!isDirty) return console.log('not dirty');

      // generate payload from dirty fields:
      const payload = Object.keys(data).reduce((prev, current) => {
        if (form.formState.dirtyFields[current]) {
          prev[current] = data[current];
        }
        return prev;
      }, {} as any);
      payload.$id = data.$id;
      console.log('payload to be saved', payload);
      await saveQuotation.mutateAsync(payload);

      await refetch();

      success('Registro actualizado.');
    } catch (err) {
      handleErrors(err, error);
    }
  });

  const onRemove = async () => {
    try {
      if (confirm('¿Seguro de eliminar este registro?') === false) return;
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

  const items = watch('items');

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <div className="flex flex-row justify-between">
        <ReadonlyFormField
          control={control}
          name="createdBy"
          label="Realizado por:"
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
      <div className="bg-white -ml-6 -mr-6 p-8 -mb-6 rounded-b-lg border-default-200 border-b-1 flex flex-col gap-2">
        <QuotationItemsList form={form} items={items} />

        {/* <pre>{JSON.stringify(items, null, 1)}</pre> */}

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

        <div className="flex flex-row justify-between bg-default-200 rounded-lg p-8 mt-4">
          <div className="flex flex-col gap-2 flex-1">
            <ReadonlyFormField
              control={control}
              name="subtotal"
              label="Subtotal"
              labelSize="2xl"
              fontSize="2xl"
              prefix="$"
            />
          </div>
          <Divider orientation="vertical" className="h-14 mx-10" />
          <div className="flex flex-col gap-2 flex-1">
            <ReadonlyFormField
              control={control}
              name="iva"
              label="IVA 16%"
              labelSize="2xl"
              fontSize="2xl"
              prefix="$"
            />
          </div>
          <Divider orientation="vertical" className="h-14 mx-10" />
          <div className="flex flex-col gap-2 flex-1">
            <ReadonlyFormField
              control={control}
              name="total"
              label="Total"
              labelSize="2xl"
              fontSize="2xl"
              prefix="$"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default QuotationForm;
