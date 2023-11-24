import { Field, PasswordInput, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import {
  updateUserPrefs,
  useAccountCreate,
  useAccountDelete,
  useAccountSingle,
  useAccountUpdateEmail,
  useAccountUpdateName,
  useAccountUpdatePassword,
  useAccountUpdatePhone
} from './account.hooks';
import type { AccountDto } from './account';
import { FormButton } from '@/ui/Buttons';
import { GiSaveArrow } from 'react-icons/gi';
import { PiTrashBold } from 'react-icons/pi';
import { useNotifications } from '@/core/useNotifications';
import { handleErrors } from '@/core/utils';
import type { DialogWidget } from '@/ui/Dialog';
import Avatar from '@/ui/Avatar';
import { ID } from '@/core/appwriteClient';
import { useQueryClient } from '@tanstack/react-query';

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

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    // setError,
    formState: { isValid, dirtyFields, isSubmitSuccessful }
  } = useForm<AccountDto>({
    values: data
  });

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     refetch();
  //   }
  // }, [isSubmitSuccessful]);

  const createAccount = useAccountCreate();
  const removeAccount = useAccountDelete();
  const updatePassword = useAccountUpdatePassword();
  const updateEmail = useAccountUpdateEmail();
  const updatePhone = useAccountUpdatePhone();
  const updateName = useAccountUpdateName();

  const queryClient = useQueryClient();

  const onSubmit = handleSubmit(async (data: AccountDto) => {
    try {
      if (!isValid) return;

      if (dirtyFields.email) {
        await updateEmail.mutateAsync(data);
        success('Email actualizado');
      }
      if (dirtyFields.prefs?.phone) {
        // try {
        await updatePhone.mutateAsync(data);
        success('Teléfono actualizado');
        // } catch (e) {
        //   console.log('e', e);
        //   if (e.code === 400) {
        //     setError('phone', {
        //       message:
        //         'Formato invalido. Debe iniciar con + y tener un  maximo de 15 digitos.'
        //     });
        //   }
        //   throw e;
        // }
      }

      if (dirtyFields.name) {
        await updateName.mutateAsync(data);
        success('Nombre actualizado');
      }

      if (dirtyFields.password) {
        await updatePassword.mutateAsync(data);
        success('Password actualizado');
      }

      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (e: any) {
      handleErrors(e, error);
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
      data.$id = ID.unique();
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
      <div className={dialog ? 'self-center' : ''}>
        <Avatar
          fileId={watch('prefs.avatar')}
          width={100}
          height={100}
          onChange={onAvatarChange}
        />
      </div>
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      <FormField control={control} name="name" label="Nombre" />
      <FormField control={control} name="email" label="Email" />
      <FormField control={control} name="prefs.phone" label="Teléfono" />
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
