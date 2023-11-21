import AppShell from '@/common/AppShell';
import { useCustomerList } from './customer.hooks';
import Container from '@/ui/Container';
import Title from '@/ui/Title';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';
import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import { PiPlus } from 'react-icons/pi';
import { RxDividerVertical } from 'react-icons/rx';
import CustomerForm from './CustomerForm';

const CustomerList = () => {
  const { query, form } = useCustomerList();

  return (
    <Container>
      <Title mt={10} mb={10} divider>
        Clientes
      </Title>
      <div className="flex flex-row justify-between items-center -ml-2 mt-5">
        <TextButton>Crear nuevo cliente</TextButton>
        <SearchInput control={form.control} name="search" />
      </div>
      <Accordion variant="light" showDivider={false}>
        {query.data?.documents.map(item => (
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
            <CustomerForm id={item.$id} />
          </AccordionItem>
        ))}
      </Accordion>
      <pre>{JSON.stringify(query.data, null, 2)}</pre>
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
