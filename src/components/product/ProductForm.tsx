import { Field, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import {
  useProductCreate,
  useProductDelete,
  useProductSingle,
  useProductUpdate
} from './product.hooks';
import type { TVCProductDto } from './product';
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

interface ProductFormProps {
  id: string;
  dialog?: DialogWidget;
}

const ProductForm: React.FC<ProductFormProps> = ({ id, dialog }) => {
  const { success, error } = useNotifications();
  const { data } = useProductSingle(id, id !== 'new');
  const { control, handleSubmit, getValues } = useForm<TVCProductDto>({
    values: data
  });
  const createProduct = useProductCreate();
  const saveProduct = useProductUpdate();
  const removeProduct = useProductDelete();

  const onSubmit = handleSubmit(async (data: TVCProductDto) => {
    try {
      await saveProduct.mutateAsync(data);
      success('Registro actualizado.');
    } catch (err) {
      handleErrors(err, error);
    }
  });
  const onRemove = async () => {
    try {
      if (confirm('¿Estás seguro de eliminar este registro?') === false) return;
      await removeProduct.mutateAsync(id);
      success('Registro eliminado.');
    } catch (err) {
      handleErrors(err, error);
    }
  };

  const onCreate = async (s: string) => {
    try {
      const data = getValues();
      await createProduct.mutateAsync(data);
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
      <FormField control={control} name="businessName" label="Razón social" />
      <FormField
        control={control}
        name="address"
        label="Domicilio Fiscal"
        rows={1}
      />
      <FormField control={control} name="email" label="Email" />
      <FormField control={control} name="phone" label="Teléfono" />
      <FormField control={control} name="taxRegime" label="Régimen Fiscal" />
      {id !== 'new' && (
        <>
          <Field label="Cotizaciones">Aquí iran las cotizaciones</Field>
          <div className="flex flex-row justify-between items-center">
            <FormButton
              onPress={onRemove}
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

export default ProductForm;
