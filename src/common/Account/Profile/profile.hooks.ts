import { useNotifications } from '@/core/useNotifications';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { ProfileDto } from './profile.dto';
import { account } from '@/core/appwriteClient';
import { handleErrors } from '@/core/utils';
import { useDialog } from '@/ui/Dialog';

const getAccount = async () => {
  const acc = await account.get();
  const prefs = await account.getPrefs();
  acc.prefs = prefs;
  return acc;
};

export const useProfileLogic = () => {
  const { success, error } = useNotifications();

  const form = useForm<ProfileDto>({
    defaultValues: getAccount
  });

  const {
    reset,
    getValues,
    setValue,
    formState: { isSubmitSuccessful, isValid, dirtyFields }
  } = form;

  const askForPasswordDialog = useDialog();

  const askForPassword = async () => {
    const dialogResponse = await askForPasswordDialog.open('');
    return dialogResponse?.feedback?.password;
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmit = form.handleSubmit(async (data: ProfileDto) => {
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
    } catch (e: any) {
      if (e?.feedback === 'cancel') {
        console.log(e);
        return;
      }
      handleErrors(e, error, {
        'Missing required parameter: "password"': 'Debe ingresar el password'
      });
    }
  });

  const onAvatarChange = async (fileId: string) => {
    const prefs = getValues('prefs') || {};
    prefs.avatar = fileId;
    await account.updatePrefs(prefs);
    setValue('prefs', prefs);
    success('Imagen de perfil actualizada');
  };

  return { form, onSubmit, onAvatarChange, askForPasswordDialog };
};
