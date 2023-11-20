import AppShell from '@/common/AppShell';

const CustomerForm = () => {
  return <div>CustomerForm</div>;
};

const WithAppShell = () => {
  return (
    <AppShell>
      <CustomerForm />
    </AppShell>
  );
};

export default WithAppShell;
