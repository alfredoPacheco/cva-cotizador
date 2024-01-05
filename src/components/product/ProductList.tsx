import './ProductList.scss';
import AppShell from '@/common/AppShell';
import { useProductList } from './product.hooks';
import Container from '@/ui/Container';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Image,
  Pagination
} from '@nextui-org/react';
import { DialogWidget } from '@/ui/Dialog';
import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '@/core/utils';
import { PiLink } from 'react-icons/pi';
import ProductQuantity from './ProductQuantity';
import { useForm } from 'react-hook-form';
import { useSyscomProductList } from '../product-syscom/product.hooks';
import { useDebounce } from '@/core';
import type { TVCProductDto } from './product';
import type { SyscomProductDto } from '../product-syscom/product';

const searchLocally = (query: string) => (item: any) => {
  if (!query || query.trim() === '') return true;
  return Object.keys(item).some(key => {
    if (typeof item[key] === 'string') {
      return item[key].toLowerCase().includes(query.toLowerCase());
    }
    return false;
  });
};

export interface ProductsSelectionCount {
  [key: string]: number;
}

interface ProductListProps {
  dialog?: DialogWidget;
}

interface StandardProduct {
  $id: string;
  name: string;
  listPrice: string;
  distributorPrice: string;
  mediaMainImage: string;
  link: string;
}

const tvcToStandardProduct = (product: TVCProductDto): StandardProduct => {
  return {
    $id: 'tvc-' + product.$id,
    name: product.name,
    listPrice: product.listPrice,
    distributorPrice: product.distributorPrice,
    mediaMainImage: product.mediaMainImage,
    link: `https://tvc.mx/products/${product.$id}`
  };
};

const syscomToStandardProduct = (
  product: SyscomProductDto
): StandardProduct => {
  return {
    $id: 'syscom-' + product.$id,
    name: product.title,
    listPrice: product.priceList,
    distributorPrice: product.priceDiscount,
    mediaMainImage: product.imgMain,
    link: `https://www.syscom.mx${product.link}`
  };
};

export const ProductList: React.FC<ProductListProps> = ({ dialog }) => {
  const filtersForm = useForm(); // This form is to handle search and filters over list
  const debouncedSearch = useDebounce(filtersForm.watch('search'), 100);

  const { query } = useProductList();
  const { query: syscomQuery } = useSyscomProductList();

  const form = useForm<ProductsSelectionCount>({
    defaultValues: {}
  });

  const [filterSelected, setFilterSelected] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  const filteredItems = useMemo(() => {
    const tvcItems = query.data?.map(tvcToStandardProduct) || [];
    const syscomItems = syscomQuery.data?.map(syscomToStandardProduct) || [];
    const allItems = tvcItems.concat(syscomItems);

    if (filterSelected) {
      const selectedItems = Object.keys(form.getValues()).filter(
        key => form.getValues()[key] > 0
      );

      return allItems.filter(item => selectedItems.includes(item.$id));
    }
    return allItems.filter(searchLocally(debouncedSearch));
  }, [query.data, syscomQuery.data, debouncedSearch, filterSelected]);

  const pages = Math.ceil(filteredItems.length / pageSize);

  const items = useMemo(() => {
    if (filterSelected) return filteredItems;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, pageSize, filterSelected]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  dialog.onOk = async () => {
    const values = form.getValues();
    const selection = Object.keys(values).reduce((prev, current) => {
      if (values[current] > 0) {
        prev[current] = values[current];
      }
      return prev;
    }, {} as any);

    const selectedIds = Object.keys(selection);

    const tvcItems = query.data?.map(tvcToStandardProduct) || [];
    const syscomItems = syscomQuery.data?.map(syscomToStandardProduct) || [];
    const allItems = tvcItems.concat(syscomItems);

    const items = allItems?.filter(item => selectedIds.includes(item.$id));

    dialog.close('ok', items, selection);
  };

  return (
    <Container maxWidth="5xl">
      <div className="flex flex-row justify-between items-center mt-5 min-h-unit-16">
        {/* <TextButton onPress={dialog.open}>Crear nuevo producto</TextButton> */}
        <Checkbox
          isSelected={filterSelected}
          onValueChange={value => setFilterSelected(value)}
        >
          Mostrar seleccionados
        </Checkbox>
        {!filterSelected && (
          <SearchInput control={filtersForm.control} name="search" />
        )}
      </div>

      {filterSelected && items?.length === 0 && (
        <div className="flex flex-col justify-center items-center gap-2 h-full absolute border-default-100 border-1">
          <p className="text-default text-2xl">
            No hay productos seleccionados
          </p>
        </div>
      )}
      {/* <div className="flex flex-wrap gap-1 sm:gap-5 h-[500px] overflow-scroll sm:p-5 content-between place-content-center border-b-2 border-default-100"> */}
      <div className="ProductsGrid gap-3 sm:gap-5 h-[600px] overflow-scroll p-4 sm:p-5 content-between place-content-center border-b-2 border-default-100">
        {items?.map(item => (
          <Card
            key={item.$id}
            isFooterBlurred
            // isBlurred
            className="h-80 sm:h-[280px]"
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
            <CardBody>
              <Image
                removeWrapper
                alt="Product Image"
                className="z-0 w-full h-full object-cover"
                src={item.mediaMainImage}
              />
              {/* <div className="absolute z-10 bottom-16 left-2">
                <ProductQuantity form={form} id={item.$id} />
              </div> */}
            </CardBody>
            <CardFooter className="absolute bg-primary/60 bottom-0 z-10 flex-col py-1 px-2 items-stretch">
              <p className="text-tiny text-white truncate w-full">
                {item.name}
              </p>
              <p className="text-tiny text-white/60">
                Precio: ${formatCurrency(Number(item.listPrice))}
              </p>
              <div className="flex flex-row justify-between flex-1">
                <p className="text-tiny text-white/60 flex-1">
                  Precio de dist: $
                  {formatCurrency(Number(item.distributorPrice))}
                </p>
                <a
                  className="text-sm p-0 text-white"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* <Button size="sm" isIconOnly className="text-sm p-0" > */}
                  <PiLink />
                </a>
                {/* </Button> */}
              </div>
              <ProductQuantity form={form} id={item.$id} />
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex flex-row justify-center items-center gap-2 h-10">
        {pages > 0 && (
          <Pagination
            total={pages}
            initialPage={page}
            page={filterSelected ? 1 : page}
            onChange={handlePageChange}
          />
        )}
      </div>

      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
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
