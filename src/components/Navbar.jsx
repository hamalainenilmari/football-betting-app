import { Button, Container, Nav, Navbar as NavbarBs } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Navbar({ isLoggedIn, handleLogout }) {
  return (
    <NavbarBs className="bg-white shadow-sm mb-3 fixed-top">
      <Container>
        <Nav className="me-auto">
          <Nav.Link to="/home" as={NavLink}>
            Home
          </Nav.Link>
          <Nav.Link to="/Users" as={NavLink}>
            Users
          </Nav.Link>
          <Nav.Link to="/Predictions" as={NavLink}>
            Predictions
          </Nav.Link>
        </Nav>
        {isLoggedIn && (
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Container>
    </NavbarBs>
  );
}

export default Navbar;
