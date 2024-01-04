import { Field, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import { useEmailCreate, useEmailSingle, useEmailUpdate } from './email.hooks';
import type { EmailDto } from './email';
import { FormButton } from '@/ui/Buttons';
import { GiSaveArrow } from 'react-icons/gi';
import { PiTrashBold } from 'react-icons/pi';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';

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

interface EmailFormProps {
  id: string;
  dialog?: DialogWidget;
}

const EmailForm: React.FC<EmailFormProps> = ({ id, dialog }) => {
  const { success, error } = useNotifications();
  const { data } = useEmailSingle(id, id !== 'new');
  const { control, handleSubmit, getValues } = useForm<EmailDto>({
    values: data
  });
  const createEmail = useEmailCreate();
  const saveEmail = useEmailUpdate();

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
      <FormField control={control} name="to" label="Para" />
      <FormField control={control} name="cc" label="CC" />
      <FormField control={control} name="bcc" label="BCC" />
      <FormField control={control} name="subject" label="Título" />
    </div>
  );
};

export default EmailForm;
