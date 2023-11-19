import { Toaster } from 'react-hot-toast';
import ReactQueryProvider from '@/core/ReactQueryProvider';
import { NextUIProvider } from '@nextui-org/react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextUIProvider>
      <ReactQueryProvider>
        <Toaster />
        {children}
      </ReactQueryProvider>
    </NextUIProvider>
  );
};

export default Providers;
