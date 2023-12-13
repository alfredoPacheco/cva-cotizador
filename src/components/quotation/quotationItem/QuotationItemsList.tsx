import { FormButton } from '@/ui/Buttons';
import QuotationItemForm from './QuotationItemForm';
import type { QuotationItemDto } from './quotationItem';
import type { UseFormReturn } from 'react-hook-form';
import type { QuotationDto } from '../quotation';
import { Dialog, useDialog } from '@/ui/Dialog';
import { ProductList } from '@/components/product/ProductList';
import type { TVCProductDto } from '@/components/product/product';

interface QuotationItemsProps {
  form: UseFormReturn<QuotationDto>;
  items: QuotationItemDto[];
}
const QuotationItems: React.FC<QuotationItemsProps> = ({ form, items }) => {
  const handleAddItem = async () => {
    const lastSequenceNumber = items.reduce(
      (prev, current) => Math.max(prev, current.sequence),
      0
    );
    const added = {
      // $id: 'new',
      sequence: lastSequenceNumber + 1
    };
    form.setValue('items', [...items, added]);
  };

  const handleRemoveItem = async (index: number) => {
    form.setValue(
      'items',
      items.filter((_, i) => i !== index)
    );
  };

  const dialogProducts = useDialog();

  const onSearchProducts = async () => {
    const dialogFeddback: any = await dialogProducts.open().catch(err => {});
    // console.log('dialogFeddback', dialogFeddback);
    if ((dialogFeddback.feedback = 'ok')) {
      const lastSequenceNumber = items.reduce(
        (prev, current) => Math.max(prev, current.sequence),
        0
      );

      const [selectedItems, quantities] = dialogFeddback.args;
      // adapt TVCProductDto to QuotationItemDto
      const added = selectedItems.map(
        (item: TVCProductDto) =>
          ({
            $id: 'new',
            sequence: lastSequenceNumber + 1,
            model: item.tvcModel,
            quantity: quantities[item.$id],
            unitPrice: Number(item.listPrice),
            description: item.name
          } as QuotationItemDto)
      );

      form.setValue('items', [...items, ...added]);
    }
  };

  return (
    <div
      className="flex flex-col justify-center gap-2"
      style={{ minHeight: 120 }}
    >
      <div className="my-0 flex flex-row justify-center">
        <FormButton onPress={handleAddItem}>Agregar partida</FormButton>
        <FormButton onPress={onSearchProducts}>Buscar productos</FormButton>
      </div>

      {items?.map((item, index) => (
        <QuotationItemForm
          form={form}
          key={index}
          item={item}
          index={index}
          sequence={index + 1}
          handleRemoveItem={handleRemoveItem}
        />
      ))}

      <Dialog
        {...dialogProducts}
        title="Productos"
        size="5xl"
        okLabel="Agregar a cotización"
      >
        {dialog => <ProductList dialog={dialog} />}
      </Dialog>
    </div>
  );
};

export default QuotationItems;
