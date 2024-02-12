export enum EntryState {
  Unchanged = 0,
  Upserted = 1,
  Deleted = 2
}

export enum SelectionState {
  NULL = 0,
  NONE = 1,
  ALL = 2
}

export interface IEntity {
  Id?: number;
  Entry_State?: EntryState;
  Revisions?: Array<any>;
  RevisionMessage?: string;
  AttachmentsFolder?: string;
}

export interface Instance {
  Identifier: string;
  DisplayName: string;
}

export interface IUserAuth {
  BearerToken: string;
  UserName: string;
  Email?: string;
  Roles: string[];
  Avatars?: any;
  DisplayName?: string;
  ProfileUrl?: string;
  UserId?: number;
  Instances?: Instance[];
  CurrentInstanceId?: number;
  CurrentInstance?: string;
  BaseURL?: string;
  NestURL?: string;
  GatesURL?: string;
  AuthURL?: string;
  CatalogsURL?: string;
}

export interface IFormState {
  config: any;
  baseEntity: any;
  isLoading: boolean;
  isDisabled: boolean;
  refreshAfterLogin?: boolean;
}
