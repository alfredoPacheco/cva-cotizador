import { createContext, useContext, useEffect, useState } from 'react';
import { Dialog, useDialog } from '../Dialog';
import { CircularProgress } from '@nextui-org/react';
import { useDebounce } from '@/core';

interface IGlobalLoaderContext {
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const GlobalLoaderContext = createContext<IGlobalLoaderContext | null>(null);

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error(
      `Can't use "useGlobalLoader" without an GlobalLoaderContext`
    );
  }
  return context;
};

export const GlobalLoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // debounces only when loading is true, but hides ASAP
  const [loaderDebounced, setLoaderDebounced] = useState(loading);
  useEffect(() => {
    if (!loading) {
      setLoaderDebounced(false);
    }
    const handler = setTimeout(() => {
      setLoaderDebounced(loading);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [loading]);

  // const router = useRouter();
  // useEffect(() => {
  //   if (loading) {
  //     setLoading(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [router.asPath]);
  return (
    <GlobalLoaderContext.Provider
      value={{ loading: loaderDebounced, setLoading }}
    >
      {children}
      {loaderDebounced && (
        <Dialog
          isOpen={loaderDebounced}
          fullScreen
          actionsOff
          transparent
          formOff
        >
          {dialog => (
            <div className="flex flex-col items-center justify-center flex-1">
              <CircularProgress
                color="secondary"
                size="lg"
                aria-label="global-loader"
              />
            </div>
          )}
        </Dialog>
        // <Modal open>
        //   <Box
        //     style={{
        //       position: 'fixed',
        //       left: 0,
        //       top: 0,
        //       right: 0,
        //       bottom: 0,
        //       display: 'flex',
        //       justifyContent: 'center',
        //       alignItems: 'center'
        //     }}
        //   >
        //     <CircularProgress
        //       color='secondary'
        //       size={150}
        //       thickness={10}
        //       disableShrink={false}
        //     />
        //   </Box>
        // </Modal>
      )}
    </GlobalLoaderContext.Provider>
  );
};
