import type { BaseDto } from '@/core/ReactQueryProvider/defaultMutations';
import type { ContactDto } from '@/types';

export interface EmailDto extends BaseDto {
  $id?: string;
  to?: ContactDto[] | string;
  cc?: ContactDto[] | string;
  bcc?: ContactDto[] | string;
  subject?: string;
  body?: string;
  attachments?: string[];
  sentAt?: string | Date;
  sentBy?: string;
  quotationId?: string;
}
