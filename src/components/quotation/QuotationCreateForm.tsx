import { Autocomplete, Field, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import { useQuotationCreate } from './quotation.hooks';
import type { QuotationDto } from './quotation';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';
import { authCentralState } from '@/core/AuthCentralService';
import { useCustomerList } from '../customer/customer.hooks';

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
      }, {} as any);
      payload.$id = 'new';
      payload.createdBy = authCentralState.account.value.email;
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

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <FormField control={control} name="title" label="Titulo:" />
      <Field label="Cliente">
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
