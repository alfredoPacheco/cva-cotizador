import { AuthCentralService } from '@/core/AuthCentralService';
import useAuth from '@/core/useAuth';
import Login from '../Account/Login';
import { NextUIProvider } from '@nextui-org/react';
import { useDialog } from '@/ui/Dialog';
import AppBar from '@/components/AppBar';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth('App');

  const loginDialog = useDialog();

  AuthCentralService.useAuthSuscription({
    openLogin: loginDialog.openDialog,
    closeLogin: loginDialog.closeDialog
  });

  return (
    <NextUIProvider>
      {loginDialog.isOpen && (
        <Login isOpen={loginDialog.isOpen} onClose={loginDialog.closeDialog} />
      )}
      <AppBar logout={logout} />
      {/* <main className="green-light text-foreground bg-background"> */}
      {/* <main className="green-light bg-background"> */}
      <main className="app">{children}</main>
    </NextUIProvider>
  );
};

export default AppShell;
