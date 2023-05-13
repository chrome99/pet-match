import React, { useState, useContext } from "react";
import "./Navbar.css";
import { Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../UserContext";
import MyModal from "./Modal/MyModal";

function Navbar() {
  const { user, changeUser } = useContext(UserContext) as UserContextType;
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  //todo: edit navbar to popout sidebar.

  function logout() {
    changeUser(null);
  }

  return (
    <>
      <div id="myNavbar">
        <Link to="/">
          <img
            id="myNavbarLogo"
            src={require("../Images/Logo.png")}
            width={200}
            height={200}
            alt="Logo"
          />
        </Link>
        <span id="navbarLinks">
          <Link className="navbarLink" to="/">
            Home
          </Link>
          <Link className="navbarLink" to="/search">
            Search
          </Link>
          <Link className="navbarLink" to="/Faq">
            FAQ
          </Link>
          {user ? (
            <Link className="navbarLink" to="/contact">
              Contact
            </Link>
          ) : null}

          {/* {user && user.admin ? <Link to="/dashboard">DASHBOARD</Link> : null} */}
          {user && user.admin ? (
            <NavDropdown
              drop="down-centered"
              title={
                <img
                  id="userIcon"
                  src={require("../Images/User.png")}
                  width={50}
                  height={50}
                  alt="User"
                />
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item
                as="button"
                onClick={() => navigate("/profile")}
              >
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as="button" onClick={() => navigate("/mypets")}>
                My Pets
              </NavDropdown.Item>
              {user?.admin ? (
                <NavDropdown.Item
                  as="button"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </NavDropdown.Item>
              ) : (
                ""
              )}
              <NavDropdown.Item as="button" onClick={logout}>
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Button
              id="loginBtn"
              variant="warning"
              onClick={() => {
                setModal(true);
              }}
            >
              Log In
            </Button>
          )}
        </span>
      </div>
      <MyModal modal={modal} setModal={setModal} />
    </>
  );
}

export default Navbar;
