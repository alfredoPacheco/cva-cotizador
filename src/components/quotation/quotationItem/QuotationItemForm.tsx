import { useForm } from 'react-hook-form';
import type { QuotationItemDto } from './quotationItem';
import { Field } from '@/ui/Inputs';

interface QutationItemFormProps {
  item: QuotationItemDto;
}
const QuotationItemForm: React.FC<QutationItemFormProps> = ({ item }) => {
  const { control } = useForm<QuotationItemDto>({ defaultValues: item });
  return (
    <div className="flex flex-col gap-10 rounded-lg border p-5">
      <div className="flex flex-row justify-between">
        <Field label="Partida">{item.sequence}</Field>
        <Field label="Modelo">{item.model}</Field>
        <Field label="P.U.">{item.unitPrice}</Field>
        <Field label="Cantidad">{item.quantity}</Field>
        <Field label="Subtotal">{item.unitPrice * item.quantity}</Field>
      </div>
      <Field label="Descripción">{item.description}</Field>
      <Field label="Imagen(es)">Imagenes aquí</Field>
    </div>
  );
};

export default QuotationItemForm;
