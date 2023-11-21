import AppShell from '@/common/AppShell';
import { useCustomerList } from './customer.hooks';
import Container from '@/ui/Container';
import Title from '@/ui/Title';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';
import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import { PiMinus, PiPlus } from 'react-icons/pi';

const CustomerList = () => {
  const { query, form } = useCustomerList();

  return (
    <Container>
      <Title mt={10} mb={10} divider>
        Clientes
      </Title>
      <div className="flex flex-row justify-between">
        <TextButton>Crear nuevo cliente</TextButton>
        <SearchInput control={form.control} name="search" />
      </div>
      <Accordion variant="light" showDivider={false}>
        {query.data?.documents.map(item => (
          <AccordionItem
            key={item.id}
            aria-label={item.name}
            disableIndicatorAnimation
            indicator={props => (
              <span className="text-white text-lg">
                {props.isOpen ? <PiMinus /> : <PiPlus />}
              </span>
            )}
            // hideIndicator
            title={
              <div className="w-full -z-10 h-20 relative">
                <div className="z-10 bg-primary rounded-xl h-20 text-white px-8 text-2xl font-extrabold flex items-center absolute -right-12 -left-4">
                  {item.name}
                </div>
              </div>
            }
            // className="bg-primary"
            // classNames={{
            //   title: 'bg-primary',
            //   heading: 'bg-primary',
            //   base: 'bg-primary'
            // }}
          >
            el contenido
          </AccordionItem>
        ))}
      </Accordion>

      <Accordion variant="bordered" showDivider={false}>
        {query.data?.documents.map(item => (
          <AccordionItem
            key={item.id}
            aria-label={item.name}
            // hideIndicator
            title={item.name}

            // className="bg-primary"
            // classNames={{
            //   title: 'bg-primary',
            //   heading: 'bg-primary',
            //   base: 'bg-primary'
            // }}
          >
            el contenido
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
