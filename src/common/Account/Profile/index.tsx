import { Button } from '@nextui-org/react';
import { Dialog } from '@/ui/Dialog';
import AppShell from '@/common/AppShell';
import Avatar from '@/ui/Avatar';
import { EmailInput, PasswordInput, PhoneInput, TextInput } from '@/ui/Inputs';
import { useProfileLogic } from './profile.hooks';

const Profile = () => {
  const { form, onSubmit, askForPasswordDialog, onAvatarChange } =
    useProfileLogic();
  const {
    getValues,
    formState: { dirtyFields, isValid }
  } = form;
  return (
    <>
      <Dialog
        isOpen={askForPasswordDialog.isOpen}
        close={askForPasswordDialog.close}
        okLabel="Guardar"
      >
        {dialog => {
          dialog.onOk = async a => {
            dialog.close(getValues());
          };
          return (
            <div className="flex flex-col gap-5">
              <h4>
                Para editar su email o telefono es necesario escribir su
                contraseña
              </h4>
              <PasswordInput
                control={form.control}
                label="Contraseña"
                focus
                required={dirtyFields.email || dirtyFields.phone}
              />
            </div>
          );
        }}
      </Dialog>

      <form
        className="container max-w-sm mx-auto flex flex-col items-center gap-5 justify-center mt-20"
        onSubmit={onSubmit}
        autoComplete="off"
      >
        <h1 className="text-4xl">Profile</h1>

        <Avatar fileId={getValues('prefs.avatar')} onChange={onAvatarChange} />

        <TextInput
          label="Nombre"
          name="name"
          control={form.control}
          color={dirtyFields.name ? 'warning' : undefined}
        />
        <EmailInput
          required
          control={form.control}
          color={dirtyFields.email ? 'warning' : undefined}
          emailVerification={getValues('emailVerification')}
        />
        <PhoneInput
          label="Teléfono"
          control={form.control}
          color={dirtyFields.phone ? 'warning' : undefined}
          requiresVerification={false}
          phoneVerification={getValues('phoneVerification')}
        />

        <Button type="submit" size="md" isDisabled={!isValid}>
          Guardar
        </Button>
      </form>
    </>
  );
};

const WithAppShell = () => {
  return (
    <AppShell>
      <Profile />
    </AppShell>
  );
};

export default WithAppShell;
