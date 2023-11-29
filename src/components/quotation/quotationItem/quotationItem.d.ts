import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

export interface QuotationItemDto extends BaseDto {
  $id: string;
  sequence: number;
  model: string;
  quantity: number;
  unitPrice: number;
  description: string;
}
