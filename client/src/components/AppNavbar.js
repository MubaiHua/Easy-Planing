import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

export default class AppNavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      username: props.username
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout() {
    sessionStorage.removeItem("token")
    window.location.href = '/';
}

  render() {
    return (
      <div>
        <Navbar className = "navbar navbar-expand-lg navbar-light fixed-top">
          <NavbarBrand >Availability Calendar</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/calender">Calender</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/task">Task Management</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={this.logout}>Logout</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
          <NavbarBrand >Welcome {this.state.username}</NavbarBrand>
        </Navbar>
      </div>
    );
  }
}