import { FormButton } from '@/ui/Buttons';
import QuotationItemForm from './QuotationItemForm';
import type { QuotationItemDto } from './quotationItem';
import type { UseFormReturn } from 'react-hook-form';
import type { QuotationDto } from '../quotation';
import { Dialog, useDialog } from '@/ui/Dialog';
import ProductList, {
  type StandardProduct
} from '@/components/product/ProductList';
import uniqueId from 'lodash/uniqueId';
import Dollar from '@/components/dollar';
import DollarSyscom from '@/components/dollar-syscom';
import { GoSearch } from 'react-icons/go';
import { PiPlusCircle } from 'react-icons/pi';
import PersistQueryProvider from '@/core/ReactQueryProvider/PersistQueryProvider';

interface QuotationItemsProps {
  form: UseFormReturn<QuotationDto>;
  items: QuotationItemDto[];
}
const QuotationItems: React.FC<QuotationItemsProps> = ({ form, items }) => {
  const handleAddItem = async () => {
    const added = {
      // $id: 'new',
      sequence: uniqueId('new-')
    } as any;
    form.setValue('items', [...items, added]);
  };

  const handleRemoveItem = async (index: number) => {
    const items = form.getValues('items');
    const itemToRemove = items[index];
    if (itemToRemove.$id && itemToRemove.$id !== 'new') {
      const removedItemsIds = form.getValues('__removedItemsIds') || [];
      form.setValue('__removedItemsIds', [
        ...removedItemsIds,
        itemToRemove.$id
      ]);
    }

    console.log('items', items);

    form.setValue(
      'items',
      items.filter(
        (item: QuotationItemDto) => item.sequence !== itemToRemove.sequence
      ),
      { shouldDirty: true }
    );
  };

  const dialogProducts = useDialog();

  const onSearchProducts = async () => {
    const dialogFeddback: any = await dialogProducts.open().catch(err => {});
    // console.log('dialogFeddback', dialogFeddback);
    if (dialogFeddback?.feedback === 'ok') {
      const [selectedItems, quantities] = dialogFeddback.args;
      // adapt TVCProductDto to QuotationItemDto
      const added = selectedItems.map(
        (item: StandardProduct) =>
          ({
            // $id: 'new',
            sequence: uniqueId('map-'),
            model: item.model,
            quantity: quantities[item.$id],
            unitPrice: Number(item.listPrice),
            description: item.name,
            providerId: item.$id.replace('tvc-', '').replace('syscom-', ''),
            provider: item.provider
          } as QuotationItemDto)
      );

      form.setValue('items', [...items, ...added], {
        shouldDirty: true
      });
    }
  };

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="my-0 flex flex-row justify-center">
        <FormButton
          onPress={handleAddItem}
          startContent={
            <span className="text-xl text-primary">
              <PiPlusCircle />
            </span>
          }
        >
          Agregar partida
        </FormButton>
        <FormButton
          onPress={onSearchProducts}
          startContent={
            <span className="text-xl text-primary">
              <GoSearch />
            </span>
          }
        >
          Buscar productos
        </FormButton>
        <PersistQueryProvider persistKey="dollar">
          <div className="flex flex-col flex-1 gap-1 justify-end">
            <DollarSyscom form={form} />
            <Dollar form={form} />
          </div>
        </PersistQueryProvider>
      </div>

      {items?.map((item, index) => (
        <QuotationItemForm
          form={form}
          key={item.sequence}
          item={item}
          index={index}
          partida={index + 1}
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
