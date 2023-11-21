import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

export interface CustomerDto extends BaseDto {
  $id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxRegime?: string;
  // city: string;
  // state: string;
  // zip: string;
  // country: string;
  // notes: string;
}
