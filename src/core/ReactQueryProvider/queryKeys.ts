export interface ListQueryType {
  type: 'list';
  limit: number;
  page: number;
  params?: any;
  queries?: string[];
}

export enum MutationTypes {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

type ListQueryKey = [string, ListQueryType];
type ByIdQueryKey = [string, string];

export type QueryType = ListQueryKey | ByIdQueryKey;
