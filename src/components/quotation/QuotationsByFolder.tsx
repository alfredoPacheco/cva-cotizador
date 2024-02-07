import AppShell from '@/common/AppShell';
import Container from '@/ui/Container';
import { QuotationList } from './QuotationList';

const QuotationsByFolder = ({ folder }) => {
  return (
    <Container>
      <QuotationList folder={folder} />
    </Container>
  );
};

const WithAppShell = props => {
  return (
    <AppShell>
      <QuotationsByFolder {...props} />
    </AppShell>
  );
};

export default WithAppShell;
