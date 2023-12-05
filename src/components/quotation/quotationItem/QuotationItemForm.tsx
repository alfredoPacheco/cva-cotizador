import type { QuotationItemDto } from './quotationItem';
import { Field, FormTextInput, TextArea } from '@/ui/Inputs';
import { Divider } from '@nextui-org/react';
import { formatCurrency } from '@/core/utils';
import { useQuotationItemDelete } from './quotationItem.hooks';
import { FormButton } from '@/ui/Buttons';

interface QutationItemFormProps {
  item: QuotationItemDto;
  sequence: number;
  form: any;
  index: number;
}
const QuotationItemForm: React.FC<QutationItemFormProps> = ({
  item,
  sequence,
  form,
  index
}) => {
  const deleteMutation = useQuotationItemDelete();

  return (
    <div className="flex flex-col gap-7 rounded-lg border p-5">
      <div className="flex flex-row justify-start -ml-2">
        <FormButton onPress={() => deleteMutation.mutate(item.$id)}>
          Remover Partida
        </FormButton>
      </div>
      <div className="flex flex-row justify-between gap-5">
        <Field label="Partida">{sequence}</Field>

        <Divider orientation="vertical" className="h-15" />

        <Field label="Modelo">
          <FormTextInput
            control={form.control}
            name={`items[${index}].model`}
          />
        </Field>

        <Divider orientation="vertical" className="h-15" />

        <Field label="P.U.">
          <FormTextInput
            control={form.control}
            name={`items[${index}].unitPrice`}
          />
        </Field>

        <Divider orientation="vertical" className="h-15" />

        <Field label="Cantidad">
          <FormTextInput
            control={form.control}
            name={`items[${index}].quantity`}
          />
        </Field>

        <Divider orientation="vertical" className="h-15" />

        <Field label="Subtotal">
          $ {formatCurrency(item.unitPrice * item.quantity)}
        </Field>
      </div>

      <Field label="Descripción">
        <TextArea control={form.control} name={`items[${index}].description`} />
      </Field>

      <Field label="Imagen(es)">Imagenes aquí</Field>
    </div>
  );
};

export default QuotationItemForm;
