import { Field, RichTextEditor, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import { useEmailCreate, useEmailSingle, useEmailUpdate } from './email.hooks';
import type { EmailDto } from './email';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';
import type { ContactDto } from '@/types';
import {
  parseContacts,
  useQuotationSingle
} from '@/components/quotation/quotation.hooks';
import ContactsSelector from '@/ui/ContactsSelector';

const FormField = ({ label, name, control, rows = 0, ...props }) => {
  return (
    <Field label={label}>
      <TextInput
        control={control}
        name={name}
        variant="underlined"
        classNames={{
          inputWrapper: ['!px-0']
        }}
        {...props}
      />
    </Field>
  );
};

interface EmailFormProps {
  id: string;
  dialog?: DialogWidget;
  quotationId?: string;
  contacts?: ContactDto[] | string[];
}

const EmailForm: React.FC<EmailFormProps> = ({ id, dialog, quotationId }) => {
  const { success, error } = useNotifications();
  const { data } = useEmailSingle(id, id !== 'new');
  const { control, handleSubmit, getValues, watch } = useForm<EmailDto>({
    values: data
  });
  const createEmail = useEmailCreate();
  const saveEmail = useEmailUpdate();

  const { data: quotation } = useQuotationSingle(quotationId, !!quotationId);

  console.log('email quotation', quotation);

  const suscribers = parseContacts(quotation?.suscribers);
  console.log('suscribers', suscribers);

  const allContacts = [quotation.customer as ContactDto, ...suscribers];

  const onSubmit = handleSubmit(async (data: EmailDto) => {
    try {
      await saveEmail.mutateAsync(data);
      success('Registro actualizado.');
    } catch (err) {
      handleErrors(err, error);
    }
  });

  const onCreate = async (s: string) => {
    try {
      const data = getValues();
      data.$id = 'new';
      await createEmail.mutateAsync(data);
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
    <div className="flex flex-col gap-5">
      <FormField control={control} name="subject" label="Título" />
      <ContactsSelector
        control={control}
        name="to"
        label="Para"
        contacts={allContacts}
      />
      <ContactsSelector
        control={control}
        name="cc"
        label="Cc"
        contacts={allContacts}
      />
      <ContactsSelector
        control={control}
        name="bcc"
        label="Bcc"
        contacts={allContacts}
      />

      <Field label="">
        <RichTextEditor control={control} name="body" toolbar />
      </Field>
    </div>
  );
};

export default EmailForm;
