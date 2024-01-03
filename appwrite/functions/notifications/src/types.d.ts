import type { Models } from 'node-appwrite';

export type NOTIFICATION_TYPE = 'quote-updated' | 'quote-created';

export interface ContactDto {
  userId?: string;
  //   level?: ALERT_LEVEL;
  name?: string;
  email?: string;
  phone?: string;
}

export interface ReadByDto {
  readAt: Date;
  userId?: string;
  email?: string;
  phone?: string;
}

export interface NotificationDto extends Models.Document {
  notificationType: NOTIFICATION_TYPE;
  sentAt?: Date;
  sentBy?: string;
  payload: string | any;
  to?: string | ContactDto[];
  readBy?: string | ReadByDto[];
  title?: string;
  quotationId?: string;
  //   level?: number;
}

export interface QuotationDto extends Models.Document {
  suscribers?: string[];
}
