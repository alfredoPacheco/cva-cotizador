import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';
import type { CustomerDto } from '../customer/customer';

export interface QuotationDto extends BaseDto {
  $id: string;
  title: string;
  sentAt?: Datetime;
  sentBy?: string;
  createdBy?: string;
  updatedBy?: string;
  scope?: string;
  exclusions?: string;
  observations?: string;
  paymentConditions?: string;
  capacitation?: string;
  subtotal?: number;
  iva?: number;
  total?: number;
  customer?: CustomerDto;
  items?: QuotationItemDto[];
}
