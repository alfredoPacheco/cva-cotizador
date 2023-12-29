import { Autocomplete, Field, ReadonlyField, TextInput } from '@/ui/Inputs';
import { Divider } from '@nextui-org/react';
import { useForm, useWatch } from 'react-hook-form';
import {
  generateQuotationPDF,
  useQuotationCreate,
  useQuotationDelete,
  useQuotationPDF,
  useQuotationSingle,
  useQuotationUpdate
} from './quotation.hooks';
import type { QuotationDto } from './quotation';
import { FormButton } from '@/ui/Buttons';
import { useNotifications } from '@/core/useNotifications';
import { formatCurrency, handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';
import QuotationItemsList from './quotationItem/QuotationItemsList';
import { useQuotationItemDelete } from './quotationItem/quotationItem.hooks';
import { useCustomerList } from '../customer/customer.hooks';
import { useEffect } from 'react';
import { omit } from 'lodash';
import dayjs from 'dayjs';

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
      <div
        className={`flex flex-row items-center whitespace-nowrap text-${props.fontSize}`}
      >
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
  const { success, error, info } = useNotifications();
  const { data } = useQuotationSingle(id, id !== 'new');
  const form = useForm<QuotationDto>({
    values: {
      ...data,
      customer:
        typeof data?.customer === 'string'
          ? data?.customer
          : data?.customer?.$id,
      _convertedQuotationDate: data?.quotationDate
        ? new Date(data?.quotationDate).toISOString().split('T')[0]
        : undefined,
      _convertedValidUntil: data?.validUntil
        ? new Date(data?.validUntil).toISOString().split('T')[0]
        : undefined
    }
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isValid, isDirty, dirtyFields }
  } = form;

  const {
    query: { data: customers }
  } = useCustomerList();

  const createQuotation = useQuotationCreate();
  const saveQuotation = useQuotationUpdate();
  const removeQuotation = useQuotationDelete();
  const deleteItemMutation = useQuotationItemDelete();

  const save = async (data: QuotationDto) => {
    // console.log('data', data);
    // console.log({ isValid, isDirty });
    // console.log('dirtyFields', form.formState.dirtyFields);
    // return;
    const removedItemsIds = form.getValues('__removedItemsIds');
    if (removedItemsIds?.length) {
      removedItemsIds.forEach(async id => {
        await deleteItemMutation.mutateAsync(id);
      });
      form.setValue('__removedItemsIds', []);
    }

    if (!isValid) return console.log('not valid');
    if (!isDirty) return info('No hay cambios para guardar.');

    // generate payload from dirty fields:
    const payload: QuotationDto = Object.keys(data).reduce((prev, current) => {
      if (form.formState.dirtyFields[current]) {
        prev[current] = data[current];
      }
      return prev;
    }, {} as any);
    payload.$id = data.$id;

    if (dirtyFields._convertedQuotationDate) {
      payload.quotationDate = dayjs(
        payload._convertedQuotationDate
      ).toISOString();
    }
    if (dirtyFields._convertedValidUntil) {
      payload.validUntil = dayjs(payload._convertedValidUntil).toISOString();
    }

    console.log('payload to be saved', payload);
    if (payload.items) {
      payload.items.forEach((item, index) => {
        item.sequence = index + 1;
        item.amount = Number(item.quantity) * Number(item.unitPrice);
      });
    }
    const updated = await saveQuotation.mutateAsync(
      omit(payload, ['_convertedQuotationDate', '_convertedValidUntil'])
    );

    // We do not wait for report generation (await keyword):
    quotationPDF.mutateAsync(id);

    // await refetch();

    success('Registro actualizado.');
    return updated;
  };

  const onSubmit = handleSubmit(async (data: QuotationDto) => {
    try {
      await save(data);
    } catch (err) {
      handleErrors(err, error);
    }
  });

  const quotationPDF = useQuotationPDF();
  const handlePDF = handleSubmit(async (data: QuotationDto) => {
    try {
      const updated = await save(data);
      if (updated || !data.reportId) {
        await quotationPDF.mutateAsync(id);
      }
      window.open(`/reports/quotations/${id}.pdf`, '_blank');
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

  const items = useWatch({
    control: form.control,
    name: `items`
  });

  useEffect(() => {
    const subtotal = items?.reduce((prev, current) => {
      return prev + current.quantity * current.unitPrice;
    }, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    form.setValue('subtotal', subtotal, { shouldDirty: true });
    form.setValue('iva', iva, { shouldDirty: true });
    form.setValue('total', total, { shouldDirty: true });
  }, [items]);

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <div className="flex flex-row justify-between items-baseline">
        {/* <ReadonlyFormField
          control={control}
          name="createdBy"
          label="Realizado por:"
          readOnly
        /> */}
        <Field label="Realizado por:" size="md" style={{ minWidth: 30 }}>
          <div className={`flex flex-row items-center pt-5`}>
            <ReadonlyField control={control} name="createdBy" />
          </div>
        </Field>
        <Field label="Cliente">
          <Autocomplete
            control={control}
            name="customer"
            items={customers}
            labelProp="name"
            secondaryLabelProp="email"
          />
        </Field>
        <div
          className="flex flex-grow flex-row items-center justify-center gap-1"
          style={{ maxWidth: 200 }}
        >
          <FormButton onPress={onRemove}>Borrar</FormButton>
          <Divider orientation="vertical" className="h-5" />
          <FormButton type="submit">Guardar</FormButton>
          <Divider orientation="vertical" className="h-5" />
          <FormButton
            type="button"
            onPress={handlePDF}
            className="mr-4"
            loading={quotationPDF.isPending}
          >
            PDF
          </FormButton>
        </div>
      </div>
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}

      <div className="bg-white -ml-6 -mr-6 p-8 -mb-6 rounded-b-lg border-default-200 border-b-1 flex flex-col gap-4">
        <QuotationItemsList form={form} items={items} />

        {/* <pre>{JSON.stringify(items, null, 1)}</pre> */}
        <div className="flex flex-col sm:flex-row gap-10">
          <FormField
            control={control}
            name="_convertedQuotationDate"
            label="Fecha de cotización"
            type="date"
            rows={0}
          />

          <FormField
            control={control}
            name="_convertedValidUntil"
            label="Vigencia"
            type="date"
            rows={0}
          />
        </div>

        <FormField control={control} name="scope" label="Alcance del trabajo" />
        <FormField control={control} name="exclusions" label="Exclusiones" />
        <FormField
          control={control}
          name="observations"
          label="Observaciones"
          rows={1}
        />

        <FormField control={control} name="capacitation" label="Capacitación" />

        <FormField
          control={control}
          name="paymentConditions"
          label="Condiciones de pago"
        />

        <FormField control={control} name="warranty" label="Garantías" />

        <FormField control={control} name="notes" label="Notas" />

        <div className="flex flex-col gap-5 sm:flex-row justify-between bg-default-200 rounded-lg p-8 mt-4">
          <div className="flex flex-col gap-2 flex-1">
            <ReadonlyFormField
              control={control}
              name="subtotal"
              label="Subtotal"
              labelSize="2xl"
              fontSize="2xl"
              prefix="$"
              format={formatCurrency}
            />
          </div>
          <Divider orientation="vertical" className="h-0 sm:h-14 mx-10" />
          <div className="flex flex-col gap-2 flex-1">
            <ReadonlyFormField
              control={control}
              name="iva"
              label="IVA 16%"
              labelSize="2xl"
              fontSize="2xl"
              prefix="$"
              format={formatCurrency}
            />
          </div>
          <Divider orientation="vertical" className="h-0 sm:h-14 mx-10" />
          <div className="flex flex-col gap-2 flex-1">
            <ReadonlyFormField
              control={control}
              name="total"
              label="Total"
              labelSize="2xl"
              fontSize="2xl"
              prefix="$"
              format={formatCurrency}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default QuotationForm;
