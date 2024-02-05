import type { QuotationItemDto } from './quotationItem';
import { Field, FormLabel, FormTextInput, TextArea } from '@/ui/Inputs';
import { Divider } from '@nextui-org/react';
import { formatCurrency } from '@/core/utils';
import { FormButton } from '@/ui/Buttons';
import { type UseFormReturn } from 'react-hook-form';
import type { QuotationDto } from '../quotation';
import QuotationItemImages from './QuotationItemImages';
import { PiTrash } from 'react-icons/pi';

interface QutationItemFormProps {
  item: QuotationItemDto;
  partida: number;
  form: UseFormReturn<QuotationDto>;
  index: number;
  handleRemoveItem: (index: number) => void;
  dollar?: string | number;
}
const QuotationItemForm: React.FC<QutationItemFormProps> = ({
  item,
  partida,
  form,
  index,
  handleRemoveItem,
  dollar
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-5 pt-1">
      <div className="flex flex-row justify-start -ml-2 -mb-4">
        <FormButton
          onPress={() => handleRemoveItem(index)}
          className="text-primary-400"
          startContent={
            <span className="text-xl">
              <PiTrash />
            </span>
          }
        >
          Remover Partida
        </FormButton>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Field label="Partida" className="flex-1" style={{ maxWidth: 80 }}>
          {partida}
        </Field>

        <Divider orientation="vertical" className="h-15" />

        <Field label="Modelo" className="flex-1">
          <FormTextInput
            control={form.control}
            focus
            name={`items[${index}].model`}
            // endContent={
            //   <Button
            //     isIconOnly
            //     size="sm"
            //     style={{
            //       height: 24,
            //       marginRight: -10
            //     }}
            //     className="focus:outline-none"
            //     type="button"
            //   >
            //     <PiDotsThree size={18} />
            //   </Button>
            //   // <Button isIconOnly size="sm">

            //   // </Button>
            // }
          />
        </Field>

        <Divider orientation="vertical" className="h-15" />

        <Field label="P.U." style={{ maxWidth: '16%' }} className="flex-1">
          <FormTextInput
            control={form.control}
            name={`items[${index}].unitPrice`}
            type="number"
            min={0}
          />
        </Field>

        <Divider orientation="vertical" className="h-15" />

        <Field label="Cantidad" style={{ maxWidth: '16%' }} className="flex-1">
          <FormTextInput
            control={form.control}
            name={`items[${index}].quantity`}
            type="number"
            min={0}
          />
        </Field>

        <Divider orientation="vertical" className="h-15" />

        <div className={'flex flex-1 flex-col'} style={{ maxWidth: '16%' }}>
          <FormLabel size="md" className="text-right">
            Subtotal
          </FormLabel>
          <div className="flex flex-1 flex-col items-stretch justify-center">
            <div className="flex flex-1 flex-row items-center">
              {Number(dollar) > 0 && <span className="text-xs">USD:</span>}
              <span className="w-full text-right">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </div>
            {Number(dollar) > 0 && (
              <div className="flex flex-row items-center">
                <span className="text-xs">MXN:</span>
                <span className="w-full text-right">
                  {formatCurrency(
                    item.unitPrice * item.quantity * Number(dollar || 1)
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Field label="Descripción">
        <TextArea control={form.control} name={`items[${index}].description`} />
      </Field>

      <QuotationItemImages item={item} />
    </div>
  );
};

export default QuotationItemForm;
