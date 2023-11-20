interface ListQueryKey {
  type: 'list';
  limit: number;
  page: number;
  params?: any;
}

interface SingleQueryKey {
  type: 'single';
  id: string;
}

export type QueryKey = ListQueryKey | SingleQueryKey;
