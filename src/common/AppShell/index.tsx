import { AuthCentralService } from '@/core/AuthCentralService';
import useAuth from '@/core/useAuth';
import Login from '../Account/Login';
import { useDialog } from '@/ui/Dialog';
import AppBar from '@/components/AppBar';
import Providers from './Providers';

const AppShell = ({ children }: { children?: React.ReactNode }) => {
  const { logout } = useAuth('App');

  const loginDialog = useDialog();

  AuthCentralService.useAuthSuscription({
    openLogin: loginDialog.openDialog,
    closeLogin: loginDialog.closeDialog
  });

  return (
    <>
      {loginDialog.isOpen && (
        <Login isOpen={loginDialog.isOpen} onClose={loginDialog.closeDialog} />
      )}
      <AppBar logout={logout} />
      {/* <main className="green-light text-foreground bg-background"> */}
      {/* <main className="green-light bg-background"> */}
      <main className="app">{children}</main>
    </>
  );
};

const WithProviders = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Providers>
      <AppShell>{children}</AppShell>
    </Providers>
  );
};

export default WithProviders;
