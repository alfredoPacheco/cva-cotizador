import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <App>{children}</App>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default Providers;
