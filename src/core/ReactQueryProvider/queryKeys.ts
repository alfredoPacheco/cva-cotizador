interface ListQueryType {
  type: 'list';
  limit: number;
  page: number;
  params?: any;
}

interface SingleQueryType {
  type: 'single';
  id: string;
}

export type QueryType = ListQueryType | SingleQueryType;

export enum MutationTypes {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}
