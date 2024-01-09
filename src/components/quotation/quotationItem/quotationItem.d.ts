import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

export interface QuotationItemDto extends BaseDto {
  $id: string;
  sequence: number | string; // We use string before the item is saved
  model?: string;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
  description?: string;
  providerId?: string;
  provider?: 'tvc' | 'syscom';
  unitPriceMxn?: number;
  amountMxn?: number;
}
