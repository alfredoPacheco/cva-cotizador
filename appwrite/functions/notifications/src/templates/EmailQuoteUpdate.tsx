import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  // Img,
  Link,
  Preview,
  Text
} from '@react-email/components';

const baseUrl = Bun.env['WEBAPP_BASE_URL'];

interface QuoteUpdatedProps {
  subject?: string;
  quotationId?: string;
}

export const EmailQuoteUpdate = ({
  subject,
  quotationId
}: QuoteUpdatedProps) => (
  <Html>
    <Head />
    <Preview>{subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>CVA System Notifications</Heading>
        <Text style={{ ...text, marginBottom: '14px' }}>
          Hola, el sistema de Cotizaciones de CVA le informa:
        </Text>
        <Link
          href={`${baseUrl}/quotations#${quotationId}`}
          target="_blank"
          style={{
            ...link,
            display: 'block',
            marginBottom: '16px'
          }}
        >
          {subject}
        </Link>

        <Link
          href={`${baseUrl}/reports/quotations/${quotationId}.pdf`}
          target="_blank"
          style={{
            ...link,
            display: 'block',
            marginBottom: '16px'
          }}
        >
          Cotización en PDF
        </Link>

        {/* <Img
          src={`${baseUrl}/static/notion-logo.png`}
          width="32"
          height="32"
          alt="Notion's Logo"
        /> */}
        {/* <Text style={footer}>
          <Link
            href="https://cva-cotizador.vercel.app/"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            https://cva-cotizador.vercel.app/
          </Link>
        </Text> */}
      </Container>
    </Body>
  </Html>
);

export default EmailQuoteUpdate;

const main = {
  backgroundColor: '#ffffff'
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto'
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0'
};

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline'
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0'
};

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px'
};

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333'
};