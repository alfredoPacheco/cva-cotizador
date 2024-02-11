import './FolderList.scss';
import AppShell from '@/common/AppShell';
import { useFolderList } from './folder.hooks';
import Container from '@/ui/Container';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';
import { PiFolder } from 'react-icons/pi';
import { Dialog, useDialog } from '@/ui/Dialog';
import FolderForm from './FolderForm';
import { Card, CardBody, CardFooter } from '@nextui-org/react';

const searchLocally = (query: string) => (item: any) => {
  if (!query || query.trim() === '') return true;
  return Object.keys(item).some(key => {
    if (typeof item[key] === 'string') {
      return item[key].toLowerCase().includes(query.toLowerCase());
    }
    return false;
  });
};

const FolderList = () => {
  const dialog = useDialog();
  const { query, filtersForm, debouncedSearch } = useFolderList(!dialog.isOpen);

  const filteredData = query.data?.filter(searchLocally(debouncedSearch));

  return (
    <Container>
      <Dialog {...dialog} formOff okLabel="Guardar" title="Folder">
        {d => <FolderForm id="new" dialog={d} />}
      </Dialog>
      <div className="flex flex-col sm:flex-row justify-between items-center mx-0 sm:-ml-1 mt-5 gap-3 sm:gap-0">
        <TextButton onPress={dialog.open}>Crear nuevo folder</TextButton>
        <SearchInput control={filtersForm.control} name="search" />
      </div>
      {query.isError && <div>Error: {query.error.message}</div>}
      <div className="FoldersGrid gap-3 content-between place-content-center">
        <div
          key={'emptyFolder'}
          className="flex flex-col items-center justify-center"
        >
          <Card
            shadow="none"
            isPressable
            onPress={() => {
              // using setTimeout to wait for animation
              setTimeout(() => {
                window.location.href = `/no-folder`;
              }, 400);
            }}
          >
            <CardBody className="p-0 text-8xl text-default items-center">
              <PiFolder />
            </CardBody>
            <CardFooter className="text-sm justify-center p-0">
              (Sin folder)
            </CardFooter>
          </Card>
        </div>
        {filteredData?.map(item => (
          <div
            key={item.$id}
            className="flex flex-col items-center justify-center"
          >
            <Card
              shadow="none"
              key={item.$id}
              isPressable
              onPress={() => {
                // using setTimeout to wait for animation
                setTimeout(() => {
                  window.location.href = `/${item.name}`;
                }, 400);
              }}
            >
              <CardBody className="p-0 text-8xl text-primary items-center">
                <PiFolder />
              </CardBody>
              <CardFooter className="text-sm justify-center p-0">
                {item.name}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
};

const WithAppShell = () => {
  return (
    <AppShell>
      <FolderList />
    </AppShell>
  );
};

export default WithAppShell;
