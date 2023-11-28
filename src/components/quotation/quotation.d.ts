import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

export interface QuotationDto extends BaseDto {
  $id: string;
  title: string;
}
