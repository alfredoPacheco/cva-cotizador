import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';
import type { CustomerDto } from '../customer/customer';
import type { QuotationItemDto } from './quotationItem/quotationItem';

export interface QuotationDto extends BaseDto {
  $id: string;
  quotationNumber: string;
  title: string;
  sentAt?: Date;
  _convertedSentAt?: string;
  validUntil?: string;
  _convertedValidUntil?: string;
  quotationDate?: string;
  _convertedQuotationDate?: string;
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
  customer?: CustomerDto | string;
  items?: QuotationItemDto[];
  __removedItemsIds?: string[];
  reportId?: string;
  notes?: string;
  warranty?: string;
  internalNotes?: string;
}
