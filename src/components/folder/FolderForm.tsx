import { Field, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import {
  useFolderCreate,
  useFolderDelete,
  useFolderSingle,
  useFolderUpdate
} from './folder.hooks';
import type { FolderDto } from './folder';
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

interface FolderFormProps {
  id: string;
  dialog?: DialogWidget;
}

const FolderForm: React.FC<FolderFormProps> = ({ id, dialog }) => {
  const { success, error } = useNotifications();
  const { data } = useFolderSingle(id, id !== 'new');
  const { control, handleSubmit, getValues } = useForm<FolderDto>({
    values: data
  });
  const createFolder = useFolderCreate();
  const saveFolder = useFolderUpdate();
  const removeFolder = useFolderDelete();

  const onSubmit = handleSubmit(async (data: FolderDto) => {
    try {
      if (id === 'new') {
        data.$id = 'new';
        await createFolder.mutateAsync(data);
        success('Registro creado.');
        dialog?.close();
        return;
      }
      await saveFolder.mutateAsync(data);
      success('Registro actualizado.');
    } catch (err) {
      handleErrors(err, error);
    }
  });

  // const onRemove = async () => {
  //   try {
  //     if (confirm('¿Estás seguro de eliminar este registro?') === false) return;
  //     await removeFolder.mutateAsync(id);
  //     success('Registro eliminado.');
  //   } catch (err) {
  //     handleErrors(err, error);
  //   }
  // };

  const onCreate = async (s: string) => {
    try {
      const data = getValues();
      data.$id = 'new';
      await createFolder.mutateAsync(data);
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
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <FormField control={control} name="name" label="Nombre" />
    </form>
  );
};

export default FolderForm;
