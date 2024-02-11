import Logo from '@/ui/Logo';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  User
} from '@nextui-org/react';
import { authCentralState } from '@/core/AuthCentralService';
import TVCDollarReadonly from '@/components/dollar/TVCDollarReadonly';
import SyscomDollarReadonly from '@/components/dollar-syscom/SyscomDollarReadonly';
import PersistQueryProvider from '@/core/ReactQueryProvider/PersistQueryProvider';

const AppBar = ({ logout }) => {
  return (
    <div
      className={`container max-w-4xl mx-auto`}
      // style={{ border: '1px solid red' }}
    >
      <Navbar
        maxWidth="full"
        className="bg-transparent h-20 sm:h-32"
        isBlurred={false}
        isBordered
        classNames={{
          // base: 'border-primary-500 border-2',
          // brand: 'border-lime-500 border-2 w-[50px]',
          // content: 'border-blue-500 border-2',
          wrapper: 'p-0'
        }}
      >
        <NavbarBrand className="max-w-24 sm:max-w-full">
          <Link href="/">
            <Logo width={120} />
          </Link>
        </NavbarBrand>
        <NavbarContent as="div" justify="end">
          <PersistQueryProvider persistKey="dollar">
            <div className="flex flex-col items-end text-sm sm:text-sm">
              <TVCDollarReadonly />
              <SyscomDollarReadonly />
            </div>
          </PersistQueryProvider>
          <Dropdown placement="bottom-end" className="bg-default-100">
            <DropdownTrigger>
              {/* <Button
              disableRipple
              className="p-0 bg-transparent data-[hover=true]:bg-transparent"
              radius="sm"
              variant="light"
            > */}
              <User
                className="cursor-pointer"
                name=""
                avatarProps={{
                  name: '',
                  // isBordered: true,
                  as: 'button',
                  className: 'transition-transform',
                  // color: 'secondary',
                  size: 'lg',
                  src: authCentralState.avatarHref.value
                  // src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
                }}
              />
              {/* </Button> */}
            </DropdownTrigger>
            <DropdownMenu aria-label="App Menu" variant="bordered">
              <DropdownItem
                key="quotations"
                onPress={() => {
                  window.location.href = '/quotations';
                }}
              >
                Cotizaciones
              </DropdownItem>
              <DropdownItem
                key="customers"
                onPress={() => {
                  window.location.href = '/customers';
                }}
              >
                Clientes
              </DropdownItem>
              <DropdownItem
                key="profile"
                onPress={() => {
                  window.location.href = '/profile';
                }}
              >
                Profile
              </DropdownItem>
              <DropdownItem
                key="users"
                onPress={() => {
                  window.location.href = '/users';
                }}
              >
                Usuarios
              </DropdownItem>
              {/* <DropdownItem key="analytics">Analytics</DropdownItem> */}
              {/* <DropdownItem key="system">System</DropdownItem> */}
              {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
              {/* <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
              <DropdownItem key="logout" color="danger" onPress={logout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      {/* <Divider /> */}
    </div>
  );
};

export default AppBar;
