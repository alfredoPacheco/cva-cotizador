import { Button } from '@nextui-org/react';
import { account } from '@/core/appwrite';
import { useForm } from '@/core';
import { handleErrors } from '@/core/utils';
import useNotifications from '@/core/useNotifications';
import { Dialog, useDialog } from '@/ui/Dialog';
import Providers from '../Providers';
import Avatar from '@/ui/Buckets/Avatar';
import { type Models } from 'appwrite';
import { EmailInput, PasswordInput, PhoneInput, TextInput } from '@/ui/Inputs';
import { useEffect } from 'react';

type accountDto = Models.User<Models.Preferences>;

const getAccount = async () => {
  console.log('getAccount========================');
  const acc = await account.get();
  const prefs = await account.getPrefs();
  acc.prefs = prefs;
  return acc;
};

const ProfileForm = () => {
  const { success, error } = useNotifications();
  const {
    control,
    isValid,
    dirtyFields,
    handleSubmit,
    reset,
    getVal,
    setVal,
    formState,
    isSubmitSuccessful
  } = useForm<accountDto>({
    load: getAccount
  });

  console.log('formState', formState);
  console.log('formdata', getVal());

  const askForPassword = async () => {
    const dialogResponse = await openDialog('');
    return dialogResponse.feedback.password;
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmit = async (data: accountDto) => {
    try {
      if (!isValid) return;

      let password = '';
      if (dirtyFields.email || dirtyFields.phone) {
        password = await askForPassword();
      }
      if (dirtyFields.email) {
        await account.updateEmail(data.email, password);
        success('Email actualizado');

        // cleanDirtyField('email');
      }
      if (dirtyFields.phone) {
        await account.updatePhone(data.phone, password);
        success('Teléfono actualizado');
        // cleanDirtyField('phone');
      }

      if (dirtyFields.name) {
        await account.updateName(data.name);
        success('Nombre actualizado');
        // cleanDirtyField('name');
      }

      // await reset
    } catch (e) {
      if (e?.feedback === 'cancel') {
        console.log(e);
        return;
      }
      handleErrors(e, error, {
        'Missing required parameter: "password"': 'Debe ingresar el password'
      });
    }
  };

  const onAvatarChange = async fileId => {
    const prefs = getVal('prefs') || {};
    prefs.avatar = fileId;
    await account.updatePrefs(prefs);
    setVal('prefs', prefs);
    success('Imagen de perfil actualizada');
  };

  const { isOpen, openDialog, onOpenChange, closeDialog } = useDialog();

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        onOpenChange={onOpenChange}
        okLabel="Guardar"
      >
        {dialog => {
          dialog.onOk = async a => {
            dialog.close(getVal());
          };
          return (
            <div className="flex flex-col gap-5">
              <h4>
                Para editar su email o telefono es necesario escribir su
                contraseña
              </h4>
              <PasswordInput
                control={control}
                label="Contraseña"
                focus
                required={dirtyFields.email || dirtyFields.phone}
              />
            </div>
          );
        }}
      </Dialog>

      <form
        className="container max-w-sm mx-auto flex flex-col items-center gap-5 h-full justify-center"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <h1 className="text-4xl">Profile</h1>

        <Avatar fileId={getVal('prefs.avatar')} onChange={onAvatarChange} />

        <TextInput
          label="Nombre"
          name="name"
          control={control}
          color={dirtyFields.name ? 'warning' : 'default'}
        />
        <EmailInput
          required
          control={control}
          color={dirtyFields.email ? 'warning' : 'default'}
          emailVerification={getVal('emailVerification')}
        />
        <PhoneInput
          label="Teléfono"
          control={control}
          color={dirtyFields.phone ? 'warning' : 'default'}
          requiresVerification={false}
          phoneVerification={getVal('phoneVerification')}
        />

        <Button type="submit" size="md" isDisabled={!isValid}>
          Guardar
        </Button>
      </form>
    </>
  );
};

const ProfileWithProviders = () => {
  return (
    <Providers>
      <ProfileForm />
    </Providers>
  );
};

export default ProfileWithProviders;
