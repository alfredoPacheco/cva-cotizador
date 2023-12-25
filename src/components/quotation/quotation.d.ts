import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';
import type { CustomerDto } from '../customer/customer';
import type { QuotationItemDto } from './quotationItem/quotationItem';

export interface QuotationDto extends BaseDto {
  $id: string;
  quotationNumber: string;
  title: string;
  sentAt?: Datetime;
  validUntil?: Datetime;
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
  __removedItemsIds?: string[];
  reportId?: string;
}
