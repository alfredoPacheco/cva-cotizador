import Logo from '@/ui/Logo';
import {
  Divider,
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
import Container from '../Container';

const AppBar = ({ logout }) => {
  return (
    <Container gap={0}>
      <Navbar
        maxWidth="full"
        className="bg-transparent h-32"
        isBlurred={false}
        isBordered
      >
        <NavbarBrand>
          <Link href="/">
            <Logo width={120} />
          </Link>
        </NavbarBrand>
        <NavbarContent as="div" justify="end">
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
                  size: 'lg'
                  // src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
                }}
              />
              {/* </Button> */}
            </DropdownTrigger>
            <DropdownMenu aria-label="App Menu" variant="bordered">
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
              {/* <DropdownItem
                key="accounts"
                onPress={() => {
                  window.location.href = '/accounts';
                }}
              >
                Accounts
              </DropdownItem> */}
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
    </Container>
  );
};

export default AppBar;
