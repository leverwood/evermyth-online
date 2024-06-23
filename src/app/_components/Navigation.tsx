"use client";

import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useAuth } from "../[user]/useAuth";

function Navigation() {
  const authValues = useAuth();
  const { user } = authValues;
  console.log(`rending nav with user:`, user);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              {user ? (
                <NavDropdown
                  title={user.pk ? user.pk : "My Account"}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item href="/api/auth/logout">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link href="/api/auth/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <pre>{JSON.stringify(authValues, null, 2)}</pre>
    </>
  );
}

export default Navigation;
