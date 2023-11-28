import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';

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
}
