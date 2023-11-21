import AppShell from '@/common/AppShell';
import { useCustomerList } from './customer.hooks';
import Container from '@/ui/Container';
import Title from '@/ui/Title';
import { TextButton } from '@/ui/Buttons';
import { SearchInput } from '@/ui/Inputs';

const CustomerList = () => {
  const { query, form } = useCustomerList();

  return (
    <Container>
      <Title mt={10} mb={10} divider>
        Clientes
      </Title>
      <div className="flex flex-row justify-between">
        <TextButton>Crear nuevo cliente</TextButton>
        <SearchInput control={form.control} name="search" />
      </div>
      <pre>{JSON.stringify(query.data, null, 2)}</pre>
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
