import { AuthCentralService } from '@/core/AuthCentralService';
import useAuth from '@/core/useAuth';
import Login from '../Account/Login';
import { useDialog } from '@/ui/Dialog';
import AppBar from '@/ui/AppBar';
import Providers from './Providers';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useGlobalLoader } from '@/ui/GlobalLoader';
import { useEffect } from 'react';

interface AppShellProps {
  children?: React.ReactNode;
  noAuth?: boolean;
  blank?: boolean;
}

const AppShell: React.FC<AppShellProps> = ({
  children,
  noAuth = false,
  blank = false
}) => {
  const { logout } = useAuth('App');

  const loginDialog = useDialog();

  AuthCentralService.useAuthSuscription({
    openLogin: loginDialog.open,
    closeLogin: loginDialog.close
  });

  const isFetching = useIsFetching();
  // const isMutating = useIsMutating();
  const { setLoading } = useGlobalLoader();

  useEffect(() => {
    setLoading(
      isFetching > 0
      //  || isMutating > 0
    );
  }, [
    isFetching,
    setLoading
    //  isMutating
  ]);

  return (
    <>
      {!noAuth && loginDialog.isOpen && (
        <Login isOpen={loginDialog.isOpen} onClose={loginDialog.close} />
      )}
      {!blank && <AppBar logout={logout} />}
      {/* <main className="green-light text-foreground bg-background"> */}
      {/* <main className="green-light bg-background"> */}
      <main className="green-light">{children}</main>
    </>
  );
};

const WithProviders: React.FC<AppShellProps> = ({
  children,
  noAuth = false,
  blank = false
}) => {
  return (
    <Providers>
      <AppShell noAuth={noAuth} blank={blank}>
        {children}
      </AppShell>
    </Providers>
  );
};

export default WithProviders;
