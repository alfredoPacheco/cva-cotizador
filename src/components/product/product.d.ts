import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

export interface ProductDto extends BaseDto {
  $id: string;
  name: string;
  brand: string;
  description: string;
  listPrice: string;
  distributorPrice: string;
  mediaMainImage: string;
}
