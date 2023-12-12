import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';
import type { QuotationDto } from '../quotation';

export interface QuotationItemDto extends BaseDto {
  $id: string;
  sequence: number;
  model?: string;
  quantity?: number;
  unitPrice?: number;
  description?: string;
  quotation?: string | QuotationDto;
}