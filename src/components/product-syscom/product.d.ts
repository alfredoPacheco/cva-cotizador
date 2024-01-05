import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

interface SyscomCategoryDto extends BaseDto {
  id: string;
  name: string;
  level: number;
  productId: string;
}

interface SyscomBrandDto extends BaseDto {
  $id?: string;
  name: string;
  id: string;
}

interface SyscomProductDto extends BaseDto {
  // $id: string;
  raw: string;
  productId: string;
  model: string;
  totalStock: number;
  title: string;
  brand: string;
  brandId: string;
  satKey: string;
  imgMain: string;
  privateLink: string;
  categories: SyscomCategoryDto[];
  pvol: string;
  brandLogo: string;
  link: string;
  icons: string;
  weight: string;
  existence: string;
  uom: string;
  uomCode: string;
  uomName: string;
  uomSat: string;
  height: string;
  large: string;
  width: string;
  prices: string;
  priceOne: string;
  priceSpecial: string;
  priceDiscount: string;
  priceList: string;
  note: string;
  attributes: string;
}
