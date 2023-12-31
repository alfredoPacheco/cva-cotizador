import AppShell from '@/common/AppShell';
import { useQuotationList } from './quotation.hooks';
import Container from '@/ui/Container';
import Title from '@/ui/Title';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';
import {
  Accordion,
  AccordionItem,
  Divider,
  type Selection
} from '@nextui-org/react';
import { PiPlus } from 'react-icons/pi';
import { RxDividerVertical } from 'react-icons/rx';
import QuotationForm from './QuotationForm';
import { Dialog, useDialog } from '@/ui/Dialog';
import type { QuotationDto } from './quotation';
import { formatDate } from '@/core/utils';
import QuotationCreateForm from './QuotationCreateForm';
import { useEffect, useState } from 'react';

const searchLocally = (query: string) => (item: any) => {
  if (!query || query.trim() === '') return true;
  return Object.keys(item).some(key => {
    if (typeof item[key] === 'string') {
      return item[key].toLowerCase().includes(query.toLowerCase());
    }
    return false;
  });
};

const ItemTitle = ({ item }: { item: QuotationDto }) => (
  <div className="flex flex-col">
    <div className="flex flex-row justify-start items-center gap-2">
      <span className="text-xs font-normal">
        <span className="font-bold">Cotización: </span>
        {item.quotationNumber}
      </span>

      <Divider orientation="vertical" className="h-6 bg-white" />

      <span className="text-xs font-normal">
        <span className="font-bold">Fecha: </span>
        {formatDate(item.quotationDate)}
      </span>

      <Divider orientation="vertical" className="h-6 bg-white" />

      <span className="text-xs font-normal">
        <span className="font-bold">Vigencia: </span>
        {formatDate(item.validUntil)}
      </span>
    </div>
    <div className="flex flex-row justify-start items-center">
      <span className="font-bold text-xl">{item.title}</span>
    </div>
  </div>
);

const QuotationList = () => {
  const dialog = useDialog();
  const { query, filtersForm, debouncedSearch } = useQuotationList(
    !dialog.isOpen
  );

  const filteredData = query.data?.filter(searchLocally(debouncedSearch));

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  // get quotationId to expand form hash param:
  const quotationId = window.location.hash.replace('#', '');
  useEffect(() => {
    if (quotationId && query.data?.length > 0) {
      const item = query.data.find(item => item.$id === quotationId);
      if (item) {
        setSelectedKeys(new Set([item.$id]));
      }
    }
  }, [quotationId, query.data]);

  return (
    <Container>
      <Dialog {...dialog} formOff okLabel="Crear" title="Cotización">
        {d => <QuotationCreateForm id="new" dialog={d} />}
      </Dialog>

      <Title mt={40} mb={40} divider>
        Cotizaciones
      </Title>

      <div className="flex flex-row justify-between items-center -ml-1 mt-5">
        <TextButton onPress={dialog.open}>Crear nueva cotización</TextButton>
        <SearchInput control={filtersForm.control} name="search" />
      </div>

      <Accordion
        variant="light"
        showDivider={false}
        selectedKeys={selectedKeys}
        onSelectionChange={value => {
          window.location.hash = '';
          setSelectedKeys(value);
        }}
      >
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
              title: 'bg-primary text-white',
              heading: 'bg-primary rounded-xl px-6 py-0',
              content: 'p-6'
            }}
            title={<ItemTitle item={item} />}
            onKeyDown={e => e.stopPropagation()}
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
