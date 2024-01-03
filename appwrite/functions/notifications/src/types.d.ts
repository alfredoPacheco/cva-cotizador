export type NOTIFICATION_TYPE = 'quote-updated';

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

export interface NotificationDto {
  $createdAt?: Date;
  notificationType: NOTIFICATION_TYPE;
  sentAt?: Date;
  sentBy?: string;
  payload: string;
  to?: string | ContactDto[];
  readBy?: string | ReadByDto[];
  title?: string;
  quotationId?: string;
  //   level?: number;
}
