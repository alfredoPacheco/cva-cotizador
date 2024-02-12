import Container from '@/ui/Container';
import HegenLogo from '@/images/hegen-fondosclaros.png';
import { Link, Divider } from '@nextui-org/react';

const Footer = () => {
  return (
    <footer>
      <Container mt={10}>
        <Divider />
        <div className="flex flex-row gap-2 sm:gap-3 items-center">
          <img src={HegenLogo.src} alt="Hegen Logo" className="w-14" />
          <Link
            size="sm"
            className="font-montHeavy text-primary-500 text-xs md:text-sm"
            href="/"
          >
            Cotizaciones
          </Link>
          <Divider
            orientation="vertical"
            className="h-4 bg-primary-400 w-[2px]"
          />
          <Link
            size="sm"
            className="font-montHeavy text-primary-500 text-xs md:text-sm"
            href="/customers"
          >
            Clientes
          </Link>
          <Divider
            orientation="vertical"
            className="h-4 bg-primary-400 w-[2px]"
          />
          <Link
            size="sm"
            className="font-montHeavy text-primary-500 text-xs md:text-sm"
            href="/users"
          >
            Usuarios
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
