import type { QuotationItemDto } from './quotationItem';
import { Field, FormTextInput, TextArea } from '@/ui/Inputs';
import { Button, Divider } from '@nextui-org/react';
import { formatCurrency } from '@/core/utils';
import { useQuotationItemDelete } from './quotationItem.hooks';
import { FormButton } from '@/ui/Buttons';
import { PiDotsThree } from 'react-icons/pi';
import { Dialog, useDialog } from '@/ui/Dialog';
import { ProductList } from '@/components/product/ProductList';

interface QutationItemFormProps {
  item: QuotationItemDto;
  sequence: number;
  form: any;
  index: number;
  handleRemoveItem;
}
const QuotationItemForm: React.FC<QutationItemFormProps> = ({
  item,
  sequence,
  form,
  index,
  handleRemoveItem
}) => {
  const deleteMutation = useQuotationItemDelete();

  const onRemoveItem = async () => {
    if (confirm('¿Estás seguro de eliminar esta partida?')) {
      if (item.$id === 'new') {
        await deleteMutation.mutate(item.$id);
        return;
      }
      handleRemoveItem(index);
    }
  };

  const dialogProducts = useDialog();

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-5 pt-1">
      <Dialog
        {...dialogProducts}
        title="Productos"
        size="5xl"
        okLabel="Agregar a cotización"
      >
        {dialog => <ProductList />}
      </Dialog>
      <div className="flex flex-row justify-start -ml-2 -mb-4">
        <FormButton onPress={onRemoveItem}>Remover Partida</FormButton>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-5">
        <Field label="Partida">{sequence}</Field>

        <Divider orientation="vertical" className="h-15" />

        <Field label="Modelo">
          <FormTextInput
            control={form.control}
            name={`items[${index}].model`}
            endContent={
              <Button
                isIconOnly
                size="sm"
                style={{
                  height: 24,
                  marginRight: -10
                }}
                className="focus:outline-none"
                type="button"
                onClick={() => dialogProducts.open().catch(err => {})}
              >
                <PiDotsThree size={18} />
              </Button>
              // <Button isIconOnly size="sm">

              // </Button>
            }
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
