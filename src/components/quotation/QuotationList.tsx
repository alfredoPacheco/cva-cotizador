import AppShell from '@/common/AppShell';
import { useQuotationList } from './quotation.hooks';
import Container from '@/ui/Container';
import Title from '@/ui/Title';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { PiPlus } from 'react-icons/pi';
import { RxDividerVertical } from 'react-icons/rx';
import QuotationForm from './QuotationForm';
import { Dialog, useDialog } from '@/ui/Dialog';

const searchLocally = (query: string) => (item: any) => {
  if (!query || query.trim() === '') return true;
  return Object.keys(item).some(key => {
    if (typeof item[key] === 'string') {
      return item[key].toLowerCase().includes(query.toLowerCase());
    }
    return false;
  });
};

const QuotationList = () => {
  const dialog = useDialog();
  const { query, filtersForm, debouncedSearch } = useQuotationList(
    !dialog.isOpen
  );

  const filteredData = query.data?.filter(searchLocally(debouncedSearch));

  return (
    <Container>
      <Dialog {...dialog} formOff okLabel="Guardar" title="Cotización">
        {d => <QuotationForm id="new" dialog={d} />}
      </Dialog>
      <Title mt={40} mb={40} divider>
        Cotizaciones
      </Title>
      <div className="flex flex-row justify-between items-center -ml-1 mt-5">
        <TextButton onPress={dialog.open}>Crear nueva cotización</TextButton>
        <SearchInput control={filtersForm.control} name="search" />
      </div>
      <Accordion variant="light" showDivider={false}>
        {filteredData?.map(item => (
          <AccordionItem
            key={item.$id}
            aria-label={item.title}
            indicator={props => (
              <span className="text-white text-lg">
                {props.isOpen ? <RxDividerVertical /> : <PiPlus />}
              </span>
            )}
            classNames={{
              base: 'border-1 border-default-200 rounded-xl mt-5 bg-default-200',
              title: 'bg-primary text-white text-2xl font-bold',
              heading: 'bg-primary rounded-xl px-6 py-2',
              content: 'p-6'
            }}
            title={item.title}
          >
            <QuotationForm id={item.$id} />
          </AccordionItem>
        ))}
      </Accordion>
      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
      <div style={{ minHeight: 300 }} />
    </Container>
  );
};

const WithAppShell = () => {
  return (
    <AppShell>
      <QuotationList />
    </AppShell>
  );
};

export default WithAppShell;
