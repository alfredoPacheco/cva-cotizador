import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { defaultQueryFn } from './defaultQueries';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createIDBPersister } from './indexedDbPersister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnWindowFocus: false,
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});

// const asyncStoragePersister = createAsyncStoragePersister({
//   storage: localStorage,
//   key: 'CVT_QUOTATIONS_OFFLINE_CACHE'
// });

const persistor = createIDBPersister('CVT_QUOTATIONS_OFFLINE_CACHE');

const PersistQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: persistor }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
    </PersistQueryClientProvider>
  );
};

export default PersistQueryProvider;
