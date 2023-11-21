import { Field, TextInput } from '@/ui/Inputs';
import { useForm } from 'react-hook-form';
import { useCustomerSingle } from './customer.hooks';
import type { CustomerDto } from './customer';
import { FormButton } from '@/ui/Buttons';
import { GiSaveArrow } from 'react-icons/gi';
import { PiTrashBold } from 'react-icons/pi';

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

interface CustomerFormProps {
  id: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ id }) => {
  const { data } = useCustomerSingle(id);
  const { control, handleSubmit } = useForm<CustomerDto>({ values: data });
  const onSubmit = handleSubmit(data => console.log(data));
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <FormField control={control} name="name" label="Razón social" />
      <FormField
        control={control}
        name="address"
        label="Domicilio Fiscal"
        rows={1}
      />
      <FormField control={control} name="email" label="Email" />
      <FormField control={control} name="phone" label="Teléfono" />
      <FormField control={control} name="taxRegime" label="Régimen Fiscal" />
      <Field label="Cotizaciones">Aquí iran las cotizaciones</Field>
      <div className="flex flex-row justify-between items-center">
        <FormButton
          type="submit"
          onPress={() => alert('borrar')}
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
          onPress={() => alert('guardar')}
          endContent={
            <span className="text-lg">
              <GiSaveArrow />
            </span>
          }
        >
          Guardar
        </FormButton>
      </div>
    </form>
  );
};

export default CustomerForm;
