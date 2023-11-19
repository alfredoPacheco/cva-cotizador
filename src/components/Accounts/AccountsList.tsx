import { useNotifications } from '@/core/useNotifications';
import Dialog from '@/ui/Dialog/Dialog';
import useDialog from '@/ui/Dialog/useDialog';
import useConfirmDialog from '@/ui/Dialog/useConfirmDialog';
import Providers from '../Providers';
import Title from '@/ui/Title';
import NextuiTable from '../../ui/NextuiTable/NextuiTable';
import useAccountsQuery from './useAccountsQuery';

const columns = [
  { name: 'ID', uid: '$id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'ROLE', uid: 'labels', sortable: true },
  { name: 'EMAIL', uid: 'email' },
  { name: 'PHONE', uid: 'phone' },
  { name: 'ACTIONS', uid: 'actions' }
];

const statusOptions = [
  { name: 'Active', uid: 'active' },
  { name: 'Paused', uid: 'paused' },
  { name: 'Vacation', uid: 'vacation' }
];

const INITIAL_VISIBLE_COLUMNS = ['name', 'labels', 'status', 'actions'];

const AccountsList = () => {
  const { success, error } = useNotifications();
  const { Confirm, openConfirm } = useConfirmDialog();
  const { isOpen, openDialog, onOpenChange, closeDialog } = useDialog();

  const { data } = useAccountsQuery();
  console.log('accounts data ', data);

  return (
    <>
      <Confirm />
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        onOpenChange={onOpenChange}
        okLabel="Guardar"
      >
        {dialog => {
          return <div className="flex flex-col gap-5">Un dialogo</div>;
        }}
      </Dialog>

      <div
        className={`container max-w-5xl mx-auto flex flex-col gap-5 h-full justify-center mt-14`}
      >
        <Title>Cuentas</Title>

        <NextuiTable
          users={data?.users || []}
          columns={columns}
          statusOptions={statusOptions}
          initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        />
      </div>
    </>
  );
};

const WithProviders = () => {
  return (
    <Providers>
      <AccountsList />
    </Providers>
  );
};

export default WithProviders;
