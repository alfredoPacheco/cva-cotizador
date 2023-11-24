import { Field, PasswordInput, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import {
  updateUserPrefs,
  useAccountCreate,
  useAccountDelete,
  useAccountSingle,
  useAccountUpdate
} from './account.hooks';
import type { AccountDto } from './account';
import { FormButton } from '@/ui/Buttons';
import { GiSaveArrow } from 'react-icons/gi';
import { PiTrashBold } from 'react-icons/pi';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';
import Avatar from '@/ui/Avatar';

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

interface AccountFormProps {
  id: string;
  dialog?: DialogWidget;
}

const AccountForm: React.FC<AccountFormProps> = ({ id, dialog }) => {
  const { success, error } = useNotifications();

  const { data } = useAccountSingle(id, id !== 'new');

  const { control, handleSubmit, getValues, setValue, watch } =
    useForm<AccountDto>({
      values: data
    });

  const createAccount = useAccountCreate();
  const saveAccount = useAccountUpdate();
  const removeAccount = useAccountDelete();

  const onSubmit = handleSubmit(async data => {
    try {
      await saveAccount.mutateAsync(data);
      success('Registro actualizado.');
    } catch (err) {
      handleErrors(err, error);
    }
  });

  const onRemove = (id: string) => async () => {
    try {
      if (confirm('¿Estás seguro de eliminar este registro?') === false) return;
      await removeAccount.mutateAsync(id);
      success('Registro eliminado.');
    } catch (err) {
      handleErrors(err, error);
    }
  };

  const onCreate = async (s: string) => {
    try {
      const data = getValues();
      await createAccount.mutateAsync(data);
      success('Registro creado.');
      dialog?.close();
    } catch (err) {
      handleErrors(err, error);
    }
  };

  if (dialog) {
    dialog.onOk = onCreate;
  }

  const onAvatarChange = async (fileId: string) => {
    const prefs = getValues('prefs') || {};
    prefs.avatar = fileId;
    await updateUserPrefs(id, prefs);
    setValue('prefs.avatar', fileId);
    success('Imagen de perfil actualizada');
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <Avatar
        fileId={watch('prefs.avatar')}
        width={80}
        height={80}
        onChange={onAvatarChange}
      />
      <FormField control={control} name="name" label="Nombre" />
      <FormField control={control} name="email" label="Email" />
      {/* <FormField control={control} name="businessName" label="Razón social" />
      <FormField
        control={control}
        name="address"
        label="Domicilio Fiscal"
        rows={1}
      /> */}
      <FormField control={control} name="phone" label="Teléfono" />
      <Field label="Contraseña">
        <PasswordInput control={control} name="password" variant="underlined" />
      </Field>
      {id !== 'new' && (
        <>
          <div className="flex flex-row justify-between items-center">
            <FormButton
              onPress={onRemove(data?.$id)}
              startContent={
                <span className="text-lg">
                  <PiTrashBold />
                </span>
              }
            >
              Borrar
            </FormButton>
            <FormButton
              type="submit"
              endContent={
                <span className="text-lg">
                  <GiSaveArrow />
                </span>
              }
            >
              Guardar
            </FormButton>
          </div>
        </>
      )}
    </form>
  );
};

export default AccountForm;
