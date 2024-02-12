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
import FolderBreadcrumb from '../folder/FolderBreadcrumb';
import { useFolderByName } from '../folder/folder.hooks';

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
  <div className="flex flex-col gap-2 sm:gap-0">
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
      <span className="text-2xl font-montHeavy">{item.title}</span>
    </div>
  </div>
);

interface QuotationListProps {
  folder?: string;
}
export const QuotationList: React.FC<QuotationListProps> = ({ folder }) => {
  const dialog = useDialog();
  const { data: folders } = useFolderByName(folder);

  let folderId = folders?.length > 0 ? folders[0].$id : undefined;
  if (folder === 'no-folder') folderId = 'no-folder';

  const { query, filtersForm, debouncedSearch } = useQuotationList(
    folderId,
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
    <>
      <Dialog {...dialog} formOff okLabel="Crear" title="Cotización">
        {d => <QuotationCreateForm id="new" dialog={d} />}
      </Dialog>

      <FolderBreadcrumb folder={folder} />

      <Title divider>Cotizaciones</Title>

      <div className="flex flex-col sm:flex-row justify-between items-center sm:-ml-1 sm:mt-5 gap-3 sm:gap-0">
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
              base: 'border-1 border-default-200 rounded-xl mt-2 sm:mt-5 bg-default-200',
              title: 'bg-primary text-white',
              heading:
                'bg-primary rounded-xl px-2 sm:px-6 py-0 [&>button]:py-2 sm:[&>button]:py-4',
              content: 'p-2 sm:p-6'
            }}
            title={<ItemTitle item={item} />}
            onKeyDown={e => e.stopPropagation()}
          >
            <QuotationForm id={item.$id} />
          </AccordionItem>
        ))}
      </Accordion>

      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
      {/* <div style={{ minHeight: 300 }} /> */}
    </>
  );
};

const WithAppShell = () => {
  return (
    <AppShell>
      <Container>
        <QuotationList />
      </Container>
    </AppShell>
  );
};

export default WithAppShell;
