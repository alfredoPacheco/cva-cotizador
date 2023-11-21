import Dialog from '@/ui/Dialog/Dialog';
import Title from '@/ui/Title';
import NextuiTable from '../../../ui/NextuiTable/NextuiTable';
import AppShell from '@/common/AppShell';
import { TableSetup, useAccountsLogic } from './accounts.hooks';

const AccountList = () => {
  const { confirmDialog, query } = useAccountsLogic();
  return (
    <>
      <confirmDialog.Confirm />
      {/* <Dialog isOpen={isOpen} close={close} okLabel="Guardar">
        {dialog => {
          return <div className="flex flex-col gap-5">Un dialogo</div>;
        }}
      </Dialog> */}

      <div
        className={`container max-w-5xl mx-auto flex flex-1 flex-col gap-5 h-full mt-24`}
      >
        <Title>Cuentas</Title>

        <NextuiTable
          users={query.data?.users || []}
          columns={TableSetup.columns}
          statusOptions={TableSetup.statusOptions}
          initialVisibleColumns={TableSetup.initialVisibleCols}
        />
      </div>
    </>
  );
};

const WithAppShell = () => {
  return (
    <AppShell>
      <AccountList />
    </AppShell>
  );
};

export default WithAppShell;
