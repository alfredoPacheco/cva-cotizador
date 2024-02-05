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
import { GoSearch } from 'react-icons/go';
import { PiPlusCircle } from 'react-icons/pi';
import { Field, TextInput } from '@/ui/Inputs';

interface QuotationItemsProps {
  form: UseFormReturn<QuotationDto>;
  items: QuotationItemDto[];
  dollar?: string | number;
}
const QuotationItems: React.FC<QuotationItemsProps> = ({
  form,
  items,
  dollar
}) => {
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

    // console.log('items', items);

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
            unitPrice: Number(item.distributorPrice),
            unitPriceMxn: Number(item.distributorPrice) * Number(dollar || 1),
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
      <div className="my-0 flex flex-row items-end">
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
        <div className="flex flex-1 flex-col items-end">
          <Field label="Dollar">
            <TextInput
              control={form.control}
              name="dollar"
              variant="bordered"
              type="number"
              inputWrapper="h-8"
              min={0}
            />
          </Field>
        </div>
      </div>

      {items?.map((item, index) => (
        <QuotationItemForm
          form={form}
          key={item.sequence}
          item={item}
          index={index}
          partida={index + 1}
          handleRemoveItem={handleRemoveItem}
          dollar={dollar}
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
