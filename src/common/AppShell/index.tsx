import { AuthCentralService } from '@/core/AuthCentralService';
import useAuth from '@/core/useAuth';
import Login from '../Account/Login';
import { useDialog } from '@/ui/Dialog';
import AppBar from '@/ui/AppBar';
import Providers from './Providers';

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
    openLogin: loginDialog.openDialog,
    closeLogin: loginDialog.closeDialog
  });

  return (
    <>
      {!noAuth && loginDialog.isOpen && (
        <Login isOpen={loginDialog.isOpen} onClose={loginDialog.closeDialog} />
      )}
      {!blank && <AppBar logout={logout} />}
      {/* <main className="green-light text-foreground bg-background"> */}
      {/* <main className="green-light bg-background"> */}
      <main className="app h-screen">{children}</main>
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
