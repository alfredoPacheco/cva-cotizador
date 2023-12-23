import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

export interface QuotationItemDto extends BaseDto {
  $id: string;
  sequence: number | string; // We use string before the item is saved
  model?: string;
  quantity?: number;
  unitPrice?: number;
  description?: string;
  providerId?: string;
  provider?: 'tvc' | 'syscom';
}
