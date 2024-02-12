import AppShell from '@/common/AppShell';
import { useAccountList } from './account.hooks';
import Container from '@/ui/Container';
import Title from '@/ui/Title';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { PiPlus } from 'react-icons/pi';
import { RxDividerVertical } from 'react-icons/rx';
import AccountForm from './AccountForm';
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

const AccountList = () => {
  const dialog = useDialog();
  const { query, filtersForm, debouncedSearch } = useAccountList(
    !dialog.isOpen
  );

  const filteredData = query.data?.filter(searchLocally(debouncedSearch));

  return (
    <Container>
      <Dialog {...dialog} formOff okLabel="Guardar" title="Usuario">
        {d => <AccountForm id="new" dialog={d} />}
      </Dialog>
      <Title divider className="mt-7">
        Usuarios
      </Title>
      <div className="flex flex-col sm:flex-row justify-between items-center sm:-ml-1 sm:mt-5 gap-3 sm:gap-0">
        <TextButton onPress={dialog.open}>Crear nuevo usuario</TextButton>
        <SearchInput control={filtersForm.control} name="search" />
      </div>
      <Accordion
        variant="light"
        showDivider={false}
        // selectionMode="multiple"
        // keepContentMounted
      >
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
            <AccountForm id={item.$id} />
          </AccordionItem>
        ))}
      </Accordion>
      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
      {/* <div style={{ minHeight: 300 }} /> */}
    </Container>
  );
};

const WithAppShell = () => {
  return (
    <AppShell>
      <AccountList />
    </AppShell>
  );
};

export default WithAppShell;
