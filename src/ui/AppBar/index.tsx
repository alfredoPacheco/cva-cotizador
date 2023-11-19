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

const AppBar = ({ logout }) => {
  return (
    <Navbar maxWidth="full">
      <NavbarBrand>
        <Link href="/">
          <Logo />
        </Link>
      </NavbarBrand>
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            {/* <Button
              disableRipple
              className="p-0 bg-transparent data-[hover=true]:bg-transparent"
              radius="sm"
              variant="light"
            > */}
            <User
              className="cursor-pointer"
              name="Alfredo"
              avatarProps={{
                name: '',
                // isBordered: true,
                as: 'button',
                className: 'transition-transform'
                // color: 'secondary',
                // size: 'sm'
                // src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
              }}
            />
            {/* </Button> */}
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              onClick={() => {
                window.location.href = '/profile';
              }}
            >
              Profile
            </DropdownItem>
            <DropdownItem
              key="accounts"
              onClick={() => {
                window.location.href = '/accounts';
              }}
            >
              Accounts
            </DropdownItem>
            {/* <DropdownItem key="analytics">Analytics</DropdownItem> */}
            {/* <DropdownItem key="system">System</DropdownItem> */}
            {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
            {/* <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
            <DropdownItem key="logout" color="danger" onClick={logout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default AppBar;
