import { Autocomplete, Field, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import { generateQuotationNumber, useQuotationCreate } from './quotation.hooks';
import type { QuotationDto } from './quotation';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';
import { authCentralState } from '@/core/AuthCentralService';
import { useCustomerList } from '../customer/customer.hooks';
import { useEffect } from 'react';

const FormField = ({ label, name, control, ...props }) => {
  return (
    <Field label={label}>
      <TextInput
        control={control}
        name={name}
        {...props}
        variant="underlined"
      />
    </Field>
  );
};

interface QuotationFormProps {
  id: string;
  dialog?: DialogWidget;
}

const QuotationCreateForm: React.FC<QuotationFormProps> = ({ id, dialog }) => {
  const { success, error } = useNotifications();
  const form = useForm<QuotationDto>({
    defaultValues: {
      title: ''
    }
  });

  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty }
  } = form;

  const {
    query: { data: customers }
  } = useCustomerList();

  const createQuotation = useQuotationCreate();

  const onSubmit = handleSubmit(async (data: QuotationDto) => {
    try {
      if (!isValid) return console.log('not valid');
      if (!isDirty) return console.log('not dirty');

      // generate payload from dirty fields:
      const payload = Object.keys(data).reduce((prev, current) => {
        if (form.formState.dirtyFields[current]) {
          prev[current] = data[current];
        }
        return prev;
      }, {} as any) as QuotationDto;
      payload.$id = 'new';
      payload.createdBy = authCentralState.account.value.email;
      if (payload.customer) {
        if (typeof payload.customer === 'string') {
          payload.customerId = payload.customer;
        } else {
          payload.customerId = payload.customer.$id;
        }
      }

      // default values:
      payload.exclusions =
        'Perforación y reparación de pisos de concreto y pavimento.\nPerforaciones, remodelación y resanes a muros y techos.\nExcavación, relleno y compactación de pisos de asfalto.\nCualquier trabajo de ingeniería u obra civil.';
      payload.observations =
        'Instalación, pruebas, puesta en marcha y programación del equipo se realizarán conforme a los métodos recomendados por los fabricantes.';
      payload.capacitation =
        'CVA SYSTEMS, PROPORCIONARÁ al CLIENTE, capacitación teórica y práctica para la operación, uso y manejo de los equipos instalados, capacitando al personal que se nos indique.';
      payload.paymentConditions =
        'PAGO POR TRANSFERENCIA.\nTitular CORPORATIVO MEXICANO ESPECIALIZADO EN SISTEMAS DE VIDEOVIGILANCIA, ALARMAS, GPS Y MONITOREO S.A. DE C.V.\nRFC:  CME 211111 C5A\nBanco:    SANTANDER\nCuenta:   65509091242\nClabe Interbancaria:  0143 2065 5090 9124 23\nPrecios expresados en  MONEDA NACIONAL.\nOferta válida por 15 días.';

      console.log('payload to be sent', payload);
      await createQuotation.mutateAsync(payload);
      success('Registro creado.');
      dialog?.close();
    } catch (err) {
      handleErrors(err, error);
    }
  });

  if (dialog) {
    dialog.onOk = async action => {
      // console.log('onOk', action);
      onSubmit();
    };
  }

  // generate quotationNumber from date with dayjs: YYMMDD + 3
  useEffect(() => {
    generateQuotationNumber().then(quotationNumber => {
      form.setValue('quotationNumber', quotationNumber, { shouldDirty: true });
    });
  }, []);

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <FormField control={control} name="quotationNumber" label="ID:" />
      <FormField control={control} name="title" label="Titulo:" />
      <Field label="Cliente:">
        <Autocomplete
          control={control}
          name="customer"
          items={customers}
          labelProp="name"
          secondaryLabelProp="email"
        />
      </Field>
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
    </form>
  );
};

export default QuotationCreateForm;
