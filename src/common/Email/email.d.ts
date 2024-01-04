import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';
import type { ContactDto } from '@/types';

export interface EmailDto extends BaseDto {
  $id?: string;
  to?: ContactDto[];
  cc?: ContactDto[];
  bcc?: ContactDto[];
  subject?: string;
  body?: string;
  attachments?: string[];
  sentAt?: string | Date;
  sentBy?: string;
  quotationId?: string;
}
