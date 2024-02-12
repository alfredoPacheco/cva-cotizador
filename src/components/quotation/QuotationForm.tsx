import { Field, ReadonlyField, RichTextEditor, TextInput } from '@/ui/Inputs';
import {
  Avatar,
  AvatarGroup,
  Button,
  Divider,
  Select,
  SelectItem,
  Tooltip
} from '@nextui-org/react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  useQuotationCreate,
  useQuotationDelete,
  useQuotationPDF,
  useQuotationSingle,
  useQuotationSuscribers,
  useQuotationUpdate,
  useUpdateSuscribers
} from './quotation.hooks';
import type { QuotationDto } from './quotation';
import { FormButton } from '@/ui/Buttons';
import { useNotifications } from '@/core/useNotifications';
import { formatCurrency, handleErrors } from '@/core/utils';
import { Dialog, useDialog, type DialogWidget } from '@/ui/Dialog';
import QuotationItemsList from './quotationItem/QuotationItemsList';
import { useQuotationItemDelete } from './quotationItem/quotationItem.hooks';
import { useCustomerList } from '../customer/customer.hooks';
import { useEffect, useState } from 'react';
import { get, omit } from 'lodash';
import dayjs from 'dayjs';
import Attachments from '@/ui/Attachments';
import { fileDeserialize } from '@/ui/Attachments/FileSerialize';
import { authCentralState } from '@/core/AuthCentralService';
import type { ContactDto } from '@/types';
import EmailForm from '@/common/Email/EmailForm';
import { calculateAmounts, calculateGrandTotals } from './calcs';
import { useFolderList } from '../folder/folder.hooks';

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
      _convertedQuotationDate: data?.quotationDate
        ? new Date(data?.quotationDate).toISOString().split('T')[0]
        : undefined,
      _convertedValidUntil: data?.validUntil
        ? new Date(data?.validUntil).toISOString().split('T')[0]
        : undefined,
      _attachments: data?.attachments?.map(fileDeserialize) || []
      // folder:
      //   typeof data?.folder === 'string' ? data?.folder : data?.folder?.$id
    }
  });

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { isValid, isDirty, dirtyFields }
  } = form;

  const {
    query: { data: customers }
  } = useCustomerList();

  const createQuotation = useQuotationCreate();
  const saveQuotation = useQuotationUpdate();
  const removeQuotation = useQuotationDelete();
  const deleteItemMutation = useQuotationItemDelete();

  const attachmentsApi = { saveAll: () => [] };

  const save = async (data: QuotationDto) => {
    // console.log('data', data);
    // console.log({ isValid, isDirty });
    // console.log('dirtyFields', form.formState.dirtyFields);
    // return;
    const [, serializedFiles] = await attachmentsApi.saveAll();

    data.attachments = serializedFiles;

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
    let payload: QuotationDto = Object.keys(data).reduce((prev, current) => {
      if (form.formState.dirtyFields[current]) {
        prev[current] = data[current];
      }
      return prev;
    }, {} as any);

    const keysLength = Object.keys(payload).length;
    if (keysLength === 0) return info('No hay cambios para guardar.');

    payload.$id = data.$id;

    if (payload.customer) {
      if (typeof payload.customer === 'string') {
        payload.customerId = payload.customer;
      } else {
        payload.customerId = payload.customer?.$id || null;
      }
    }

    if (dirtyFields.folder) {
      if (typeof payload.folder === 'string') {
        payload.folder = payload.folder;
      } else {
        payload.folder = payload.folder?.$id || null;
      }
    }

    if (dirtyFields._convertedQuotationDate) {
      payload.quotationDate = dayjs(
        payload._convertedQuotationDate
      ).toISOString();
    }
    if (dirtyFields._convertedValidUntil) {
      payload.validUntil = dayjs(payload._convertedValidUntil).toISOString();
    }

    if (payload.items || dirtyFields.dollar) {
      payload.items = data.items.map((item, index) => {
        const [amount, amountMxn, unitPrice, unitPriceMxn] = calculateAmounts(
          item,
          data.dollar
        );
        return {
          ...item,
          sequence: index + 1,
          amount,
          amountMxn,
          unitPrice,
          unitPriceMxn
        };
      });

      const [subtotal, iva, total, subtotalMxn, ivaMxn, totalMxn] =
        calculateGrandTotals(payload.items, data.dollar);

      payload.subtotal = subtotal;
      payload.iva = iva;
      payload.total = total;
      payload.subtotalMxn = subtotalMxn;
      payload.ivaMxn = ivaMxn;
      payload.totalMxn = totalMxn;
    }

    if (dirtyFields.dollar) {
      if (!get(payload, 'dollar')) {
        payload.dollar = null;
        payload.currency = 'USD';
      } else {
        payload.currency = 'MXN';
      }
    }

    payload = omit(payload, [
      '_convertedQuotationDate',
      '_convertedValidUntil',
      '_attachments'
    ]);
    console.log('payload to be saved', payload);
    const updated = await saveQuotation.mutateAsync(payload);

    // We do not wait for report generation (await keyword):
    quotationPDF.mutateAsync(id);

    // await refetch();

    success('Registro actualizado.');
    return updated;
  };

  const handleAttachmentsChange = (
    updatedFiles,
    serializedFiles: string[],
    directUpload,
    kind
  ) => {
    console.log({
      updatedFiles,
      serializedFiles,
      directUpload,
      kind
    });
    setValue('attachments', serializedFiles, { shouldDirty: true });
    setValue('_attachments', updatedFiles, { shouldDirty: false });
  };

  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const onSubmit = handleSubmit(async (data: QuotationDto) => {
    try {
      if (saving || pdfLoading) return;
      setSaving(true);
      await save(data);
    } catch (err) {
      handleErrors(err, error);
    } finally {
      setSaving(false);
    }
  });

  const quotationPDF = useQuotationPDF();

  const handlePDF = handleSubmit(async (data: QuotationDto) => {
    try {
      if (pdfLoading || saving) return;
      setPdfLoading(true);
      const updated = await save(data);
      if (updated || !data.reportId) {
        await quotationPDF.mutateAsync(id);
      }
      window.open(`/reports/quotations/${id}.pdf`, '_blank');
    } catch (err) {
      handleErrors(err, error);
    } finally {
      setPdfLoading(false);
    }
  });

  const handleEmail = handleSubmit(async (data: QuotationDto) => {
    try {
      await save(data);
      emailDialog.open();
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
    name: 'items'
  });

  const dollar = useWatch({
    control: form.control,
    name: 'dollar'
  });

  useEffect(() => {
    const [subtotal, iva, total, subtotalMxn, ivaMxn, totalMxn] =
      calculateGrandTotals(items, dollar);
    form.setValue('subtotal', subtotal, { shouldDirty: false });
    form.setValue('iva', iva, { shouldDirty: false });
    form.setValue('total', total, { shouldDirty: false });
    form.setValue('subtotalMxn', subtotalMxn, { shouldDirty: false });
    form.setValue('ivaMxn', ivaMxn, { shouldDirty: false });
    form.setValue('totalMxn', totalMxn, { shouldDirty: false });
  }, [items, dollar]);

  const updateSuscribers = useUpdateSuscribers();

  const { data: suscribers } = useQuotationSuscribers(id);

  const suscribeMe = async () => {
    try {
      const account = authCentralState.account.value;
      if (!account) {
        throw new Error('Inicie sesión para suscribirse.');
      }

      const alreadySuscribed = suscribers.find(
        s => s.email.toLowerCase() === account.email.toLowerCase()
      );
      if (alreadySuscribed) return;

      const updated = await updateSuscribers.mutateAsync({
        $id: id,
        suscribers: [
          ...suscribers,
          {
            email: account.email.toLowerCase(),
            name: account.name,
            phone: account.phone,
            avatarHref: authCentralState.avatarHref.value
          } as ContactDto
        ]
      });
      success('Suscripción actualizada.');
      return updated;
    } catch (err) {
      handleErrors(err, error);
    }
  };

  const removeMySuscription = async () => {
    try {
      if (confirm('¿Seguro de eliminar su suscripción?') === false) return;
      const account = authCentralState.account.value;
      if (!account) {
        throw new Error('Debe iniciar sesión.');
      }

      const alreadySuscribed = suscribers.find(
        s => s.email.toLowerCase() === account.email.toLowerCase()
      );
      if (alreadySuscribed) {
        const updatedSuscribers = suscribers.filter(
          s => s.email.toLowerCase() !== account.email.toLowerCase()
        );
        await updateSuscribers.mutateAsync({
          $id: id,
          suscribers: updatedSuscribers
        });
        success('Suscripción actualizada.');
      }
    } catch (err) {
      handleErrors(err, error);
    }
  };

  const currentAccount = authCentralState.account.value;

  const mySuscription = suscribers?.find(
    s => !!currentAccount?.email && s.email === currentAccount.email
  );

  const emailDialog = useDialog();

  const {
    query: { data: folders }
  } = useFolderList();

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <Dialog {...emailDialog} formOff okLabel="Enviar Email" title="Email">
        {d => <EmailForm id="new" dialog={d} quotationId={id} />}
      </Dialog>
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-0 sm:gap-5">
        <div className="flex">
          <Field
            label="Realizado por:"
            size="md"
            style={{ minWidth: 30 }}
            labelClassName="text-sm"
          >
            <ReadonlyField control={control} name="createdBy" fontSize="xs" />
          </Field>
        </div>
        <div className="flex w-full sm:max-w-[200px]">
          <Controller
            control={control}
            name="customer"
            render={({ field: { value, onChange } }) => {
              const selectedId = typeof value === 'string' ? value : value?.$id;
              return (
                <Select
                  label="Cliente"
                  aria-label="Cliente"
                  size="sm"
                  classNames={{ trigger: 'p-0 sm:p-3' }}
                  fullWidth
                  variant="bordered"
                  // value={selectedId}
                  selectedKeys={selectedId ? [selectedId] : []}
                  // onChange={e => onChange(e.target.value)}
                  onSelectionChange={e => {
                    const arr = [...e];
                    if (arr.length > 0) onChange(arr[0]);
                    else onChange(null);
                  }}
                >
                  {customers?.map(item => (
                    <SelectItem key={item.$id} value={item.$id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
              );
            }}
          />
        </div>
        <div className="flex flex-grow flex-col items-end gap-1 mt-4 sm:mt-0">
          <div className="flex flex-row items-center justify-evenly sm:justify-end sm:gap-1 w-full">
            <FormButton onPress={onRemove}>Borrar</FormButton>
            <Divider orientation="vertical" className="h-5" />
            <FormButton
              loading={saving || saveQuotation.isPending}
              type="submit"
            >
              Guardar
            </FormButton>
            <Divider orientation="vertical" className="h-5" />
            <FormButton type="button" onPress={handleEmail}>
              Email
            </FormButton>
            <Divider orientation="vertical" className="h-5" />
            <FormButton
              type="button"
              onPress={handlePDF}
              loading={quotationPDF.isPending || pdfLoading}
            >
              PDF
            </FormButton>
          </div>
          <AvatarGroup max={10}>
            {suscribers?.map(suscriber => (
              <Tooltip
                key={suscriber.email}
                // color={color}
                content={suscriber.email}
                className="capitalize"
              >
                <Avatar
                  isBordered
                  key={suscriber.email}
                  size="md"
                  src={suscriber.avatarHref}
                  onClick={removeMySuscription}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
          <div className="text-xs text-default-700 mt-2">
            {suscribers?.length === 0 && <span>No hay suscriptores.</span>}
            {!mySuscription && (
              <Button
                size="sm"
                className="ml-2"
                variant="flat"
                onClick={() => {
                  suscribeMe();
                }}
              >
                Suscribirme
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}

      <div className="bg-white -ml-6 -mr-6 p-8 -mb-6 rounded-b-lg border-default-200 border-b-1 flex flex-col gap-4">
        <QuotationItemsList form={form} items={items} dollar={dollar} />

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

        <div className="flex flex-col gap-3 sm:gap-5 sm:flex-row justify-between bg-default-200 rounded-lg p-5 sm:p-8 mt-4">
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
            {dollar > 0 && (
              <span className="text-sm whitespace-nowrap">
                MXN: {formatCurrency(form.watch('subtotalMxn'))}
              </span>
            )}
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
            {dollar > 0 && (
              <span className="text-sm whitespace-nowrap">
                MXN: {formatCurrency(form.watch('ivaMxn'))}
              </span>
            )}
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
            {dollar > 0 && (
              <span className="text-sm whitespace-nowrap">
                MXN: {formatCurrency(form.watch('totalMxn'))}
              </span>
            )}
          </div>
        </div>

        <div className="sm:max-w-60 flex-1">
          <Controller
            control={control}
            name="folder"
            render={({ field: { value, onChange } }) => {
              const selectedId = typeof value === 'string' ? value : value?.$id;
              return (
                <Select
                  label="Folder"
                  aria-label="Folder"
                  className="max-w-xs"
                  fullWidth
                  value={selectedId}
                  selectedKeys={selectedId ? [selectedId] : []}
                  onSelectionChange={e => {
                    const arr = [...e];
                    if (arr.length > 0) onChange(arr[0]);
                    else onChange(null);
                  }}
                >
                  {folders?.map(item => (
                    <SelectItem key={item.$id} value={item.$id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
              );
            }}
          />
          {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
        </div>

        <Field label="Archivos adjuntos">
          <Controller
            control={control}
            name="_attachments"
            render={({ field }) => (
              <Attachments
                api={attachmentsApi}
                kind="quote-attachments"
                value={field.value || []}
                onChange={handleAttachmentsChange}
              />
            )}
          />
        </Field>

        <Field label="Notas Internas">
          <RichTextEditor control={control} name="internalNotes" toolbar />
        </Field>
      </div>
    </form>
  );
};

export default QuotationForm;
