import AppShell from '@/common/AppShell';
import { useProductList } from './product.hooks';
import Container from '@/ui/Container';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';
import { Button, Card, CardFooter, Image, Pagination } from '@nextui-org/react';
import ProductForm from './ProductForm';
import { Dialog, useDialog } from '@/ui/Dialog';
import { useEffect, useMemo, useState } from 'react';

const searchLocally = (query: string) => (item: any) => {
  if (!query || query.trim() === '') return true;
  return Object.keys(item).some(key => {
    if (typeof item[key] === 'string') {
      return item[key].toLowerCase().includes(query.toLowerCase());
    }
    return false;
  });
};

export const ProductList = () => {
  const dialog = useDialog();

  const { query, filtersForm, debouncedSearch } = useProductList(
    !dialog.isOpen
  );

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const filteredItems = useMemo(() => {
    return query.data?.filter(searchLocally(debouncedSearch)) || [];
  }, [query.data, debouncedSearch]);

  const pages = Math.ceil(filteredItems.length / pageSize);

  const items = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <Container maxWidth="5xl">
      <Dialog {...dialog} formOff okLabel="Guardar" title="Producto">
        {d => <ProductForm id="new" dialog={d} />}
      </Dialog>

      <div className="flex flex-row justify-between items-center -ml-1 mt-5">
        <TextButton onPress={dialog.open}>Crear nuevo producto</TextButton>
        <SearchInput control={filtersForm.control} name="search" />
      </div>

      <div className="flex flex-wrap gap-5 h-[450px] overflow-scroll p-5 justify-start ">
        {items?.map(item => (
          <Card
            key={item.$id}
            isFooterBlurred
            className="h-[270px] flex-grow w-[200px] max-w-[220px]"
            // isPressable
            // onPress={() => console.log('item pressed')}
          >
            {/* <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-default uppercase font-bold">
                Your day your way {item.$id}
              </p>
              <h4 className="text-default font-medium text-xl">
                Your checklist for better sleep {item.brand}
              </h4>
            </CardHeader> */}
            <Image
              removeWrapper
              alt="Product Image"
              className="z-0 w-full h-full object-cover"
              src={item.mediaMainImage}
            />
            <CardFooter className="absolute bg-primary/60 bottom-0 z-10 flex-col py-1 px-2">
              <p className="text-tiny text-white truncate w-full">
                {item.name}
              </p>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-grow gap-2 items-center">
                  {/* <Image
                  alt="Breathing app icon"
                  className="rounded-full w-10 h-11 bg-black"
                  src="/images/breathing-app-icon.jpeg"
                /> */}
                  <div className="flex flex-col">
                    <p className="text-tiny text-white truncate w-[100px]">
                      {item.name}
                    </p>
                    <p className="text-tiny text-white/60">
                      Get a good night's sleep.
                    </p>
                  </div>
                </div>
                <Button radius="full" size="sm">
                  Get App
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex flex-row justify-center items-center gap-2">
        <Pagination
          total={pages}
          initialPage={page}
          page={page}
          onChange={handlePageChange}
        />
      </div>

      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
    </Container>
  );
};

const WithAppShell = () => {
  return (
    <AppShell>
      <ProductList />
    </AppShell>
  );
};

export default WithAppShell;
