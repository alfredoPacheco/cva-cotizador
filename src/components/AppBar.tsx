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
import Logo from '../images/logo.svg';

const AppBar = ({ onLogout }) => {
  return (
    <Navbar maxWidth="full">
      <NavbarBrand>
        <Link href="/">
          <img src={Logo.src} alt="Logo" width="150" />
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
            {/* <DropdownItem key="team_settings">Team Settings</DropdownItem> */}
            {/* <DropdownItem key="analytics">Analytics</DropdownItem> */}
            {/* <DropdownItem key="system">System</DropdownItem> */}
            {/* <DropdownItem key="configurations">Configurations</DropdownItem> */}
            {/* <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
            <DropdownItem key="logout" color="danger" onClick={onLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default AppBar;
