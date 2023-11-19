import { useEffect, useReducer, useState } from 'react';
import { AuthCentralService } from './AuthCentralService';
import { useQueryClient } from '@tanstack/react-query';
import type { Models } from 'appwrite';
import { Roles } from '.';

interface IUseAuthReturn {
  auth?: Models.Session;
  login({ email, password }: { email: string; password: string });
  logout();
  hasRole(role: string);
  Roles: typeof Roles;
}

const useAuth = (
  calledFrom?: string,
  enabled: boolean = true
): IUseAuthReturn => {
  const queryClient = useQueryClient();
  const { auth, logout: _logout, login, hasRole } = AuthCentralService;

  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
    if (!enabled) return;
    const subscription = AuthCentralService.OnAuthChange.subscribe(
      (newAuth?: Models.Session) => {
        forceUpdate();
        console.log('auth change called from', calledFrom, { auth, newAuth });
      }
    );
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const logout = () => {
    queryClient.clear();
    _logout();
  };

  return {
    auth,
    login,
    logout,
    hasRole,
    Roles
  };
};

export default useAuth;
