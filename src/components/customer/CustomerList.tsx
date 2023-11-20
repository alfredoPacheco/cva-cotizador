import AppShell from '@/common/AppShell';

const CustomerList = () => {
  return <div>CustomerList</div>;
};

const WithAppShell = () => {
  return (
    <AppShell>
      <CustomerList />
    </AppShell>
  );
};

export default WithAppShell;
