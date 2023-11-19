import { useDisclosure } from '@nextui-org/react';
import AppBar from './AppBar';
import Login from './Login/Login';
import useAuth from '@/core/useAuth';
import { AuthCentralService } from '@/core/AuthCentralService';

const App = ({ children }) => {
  const { logout } = useAuth('App');

  const {
    isOpen,
    onOpen: openLogin,
    onOpenChange,
    onClose: closeLogin
  } = useDisclosure();

  AuthCentralService.useAuthSuscription({ openLogin, closeLogin });

  return (
    <>
      {isOpen && <Login isOpen={isOpen} onOpenChange={onOpenChange} />}
      <AppBar onLogout={logout} />
      {children}
    </>
  );
};

export default App;
