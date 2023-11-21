import AppShell from '@/common/AppShell';
import { useCustomerList } from './customer.hooks';
import Container from '@/ui/Container';

const CustomerList = () => {
  const { data } = useCustomerList();
  return (
    <Container>
      CustomerList
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Container>
  );
};

const WithAppShell = () => {
  return (
    <AppShell>
      <CustomerList />
    </AppShell>
  );
};

export default WithAppShell;
