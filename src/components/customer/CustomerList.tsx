import AppShell from '@/common/AppShell';
import { useCustomerList } from './customer.hooks';
import Container from '@/ui/Container';
import Title from '@/ui/Title';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { PiPlus } from 'react-icons/pi';
import { RxDividerVertical } from 'react-icons/rx';
import CustomerForm from './CustomerForm';
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

const CustomerList = () => {
  const dialog = useDialog();
  const { query, filtersForm, debouncedSearch } = useCustomerList(
    !dialog.isOpen
  );

  const filteredData = query.data?.filter(searchLocally(debouncedSearch));

  return (
    <Container>
      <Dialog {...dialog} formOff okLabel="Guardar" title="Cliente">
        {d => <CustomerForm id="new" dialog={d} />}
      </Dialog>
      <Title mt={40} mb={40} divider>
        Clientes
      </Title>
      <div className="flex flex-row justify-between items-center -ml-1 mt-5">
        <TextButton onPress={dialog.open}>Crear nuevo cliente</TextButton>
        <SearchInput control={filtersForm.control} name="search" />
      </div>
      <Accordion variant="light" showDivider={false}>
        {filteredData?.map(item => (
          <AccordionItem
            key={item.$id}
            aria-label={item.name}
            indicator={props => (
              <span className="text-white text-lg">
                {props.isOpen ? <RxDividerVertical /> : <PiPlus />}
              </span>
            )}
            classNames={{
              base: 'border-1 border-default-200 rounded-xl mt-5',
              title: 'bg-primary text-white text-2xl font-bold',
              heading: 'bg-primary rounded-xl px-6 py-2',
              content: 'p-6'
            }}
            title={item.name}
          >
            <CustomerForm id={item.$id} item={item} />
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
      <CustomerList />
    </AppShell>
  );
};

export default WithAppShell;
