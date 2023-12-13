import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';
import type { QuotationDto } from '../quotation';

export interface QuotationItemDto extends BaseDto {
  $id: string;
  sequence: number | string; // We use string before the item is saved
  model?: string;
  quantity?: number;
  unitPrice?: number;
  description?: string;
  quotation?: string | QuotationDto;
  providerId?: string;
  provider?: 'tvc' | 'syscom';
}
