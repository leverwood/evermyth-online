"use client";

import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import Link from "next/link";

function Navigation({ userPK }: { userPK: string }) {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Link href={"/"}>
            <Navbar.Brand>React-Bootstrap</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {userPK ? (
                <NavDropdown title={userPK} id="basic-nav-dropdown">
                  <Link href="/profile" passHref>
                    <span className="dropdown-item">Profile</span>
                  </Link>
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
    </>
  );
}

export default Navigation;
