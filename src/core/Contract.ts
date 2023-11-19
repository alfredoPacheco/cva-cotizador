export enum SelectionState {
  NULL = 0,
  NONE = 1,
  ALL = 2
}

export interface Instance {
  Identifier: string;
  DisplayName: string;
}

// export interface IUserAuth {
//   BearerToken: string;
//   UserName: string;
//   Email?: string;
//   Roles: string[];
//   Avatars?: any;
//   DisplayName?: string;
//   ProfileUrl?: string;
//   UserId?: number;
//   Instances?: Instance[];
//   CurrentInstanceId?: number;
//   CurrentInstance?: string;
//   BaseURL?: string;
//   NestURL?: string;
//   GatesURL?: string;
//   AuthURL?: string;
//   CatalogsURL?: string;
// }
