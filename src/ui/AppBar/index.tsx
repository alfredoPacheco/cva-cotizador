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
    <Navbar maxWidth="full" className="bg-transparent h-28 ">
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
          <DropdownMenu aria-label="Profile Actions" variant="faded">
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
