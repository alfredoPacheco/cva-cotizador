import { FormButton } from '@/ui/Buttons';
import { useQuotationItemList } from './quotationItem.hooks';
import QuotationItemForm from './QuotationItemForm';

const QuotationItems = ({ quotationId }) => {
  const { query } = useQuotationItemList();

  return (
    <div className="flex flex-col justify-center" style={{ minHeight: 120 }}>
      {query.data?.map(item => (
        <QuotationItemForm key={item.$id} item={item} />
      ))}
      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
      <div className="my-5 flex flex-col justify-center">
        <FormButton>Agregar Partida</FormButton>
      </div>
    </div>
  );
};

export default QuotationItems;
