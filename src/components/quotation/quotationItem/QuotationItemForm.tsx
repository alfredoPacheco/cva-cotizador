import { useForm } from 'react-hook-form';
import type { QuotationItemDto } from './quotationItem';
import { Field } from '@/ui/Inputs';
import { Divider } from '@nextui-org/react';

interface QutationItemFormProps {
  item: QuotationItemDto;
}
const QuotationItemForm: React.FC<QutationItemFormProps> = ({ item }) => {
  const { control } = useForm<QuotationItemDto>({ defaultValues: item });
  return (
    <div className="flex flex-col gap-7 rounded-lg border p-5">
      <div className="flex flex-row justify-between">
        <Field label="Partida">{item.sequence}</Field>
        <Divider orientation="vertical" className="h-10" />
        <Field label="Modelo">{item.model}</Field>
        <Divider orientation="vertical" className="h-10" />
        <Field label="P.U.">{item.unitPrice}</Field>
        <Divider orientation="vertical" className="h-10" />
        <Field label="Cantidad">{item.quantity}</Field>
        <Divider orientation="vertical" className="h-10" />
        <Field label="Subtotal">{item.unitPrice * item.quantity}</Field>
      </div>
      <Field label="Descripción">{item.description}</Field>
      <Field label="Imagen(es)">Imagenes aquí</Field>
    </div>
  );
};

export default QuotationItemForm;
