import { FormButton } from '@/ui/Buttons';
import QuotationItemForm from './QuotationItemForm';
import type { QuotationItemDto } from './quotationItem';
import type { UseFormReturn } from 'react-hook-form';
import type { QuotationDto } from '../quotation';

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

  return (
    <div
      className="flex flex-col justify-center gap-2"
      style={{ minHeight: 120 }}
    >
      {items?.map((item, index) => (
        <QuotationItemForm
          form={form}
          key={index}
          item={item}
          index={index}
          sequence={index + 1}
        />
      ))}

      <div className="my-5 flex flex-col justify-center">
        <FormButton onPress={handleAddItem}>Agregar Partida</FormButton>
      </div>
    </div>
  );
};

export default QuotationItems;
