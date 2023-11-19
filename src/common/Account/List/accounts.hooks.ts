import { useQuery } from '@tanstack/react-query';
import { functions } from '@/core/appwriteClient';
import type { Models } from 'appwrite';
import { useNotifications } from '@/core/useNotifications';
import { useConfirmDialog, useDialog } from '@/ui/Dialog';

export const TableSetup = {
  columns: [
    { name: 'ID', uid: '$id', sortable: true },
    { name: 'NAME', uid: 'name', sortable: true },
    { name: 'ROLE', uid: 'labels', sortable: true },
    { name: 'EMAIL', uid: 'email' },
    { name: 'PHONE', uid: 'phone' },
    { name: 'ACTIONS', uid: 'actions' }
  ],
  statusOptions: [
    { name: 'Active', uid: 'active' },
    { name: 'Paused', uid: 'paused' },
    { name: 'Vacation', uid: 'vacation' }
  ],
  initialVisibleCols: ['name', 'labels', 'status', 'actions']
};

const getAccounts = async () => {
  const resp = await functions.createExecution(
    'accounts',
    '',
    false,
    '/',
    'GET'
  );
  const json: { users: Models.User<Models.Preferences>[] } = JSON.parse(
    resp.responseBody
  );
  return json;
};

export const useAccountsQuery = () => {
  return useQuery({ queryKey: ['accounts'], queryFn: () => getAccounts() });
};

export const useAccountsLogic = () => {
  const { success, error } = useNotifications();
  const confirmDialog = useConfirmDialog();
  const { isOpen, openDialog, closeDialog } = useDialog();

  const query = useAccountsQuery();

  return { query, confirmDialog };
};
