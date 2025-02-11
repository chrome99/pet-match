import React, { useState, useContext } from "react";
import "./Navbar.css";
import { Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../../Contexts/UserContext";
import MyModal from "./Modal/MyModal";

interface NavbarProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar({ modal, setModal }: NavbarProps) {
  const { user, changeUser } = useContext(UserContext) as UserContextType;
  const navigate = useNavigate();

  function logout() {
    changeUser(null);
  }

  return (
    <>
      <div id="myNavbar">
        <Link to="/">
          <img
            id="myNavbarLogo"
            src={require("../../Assets/Images/Logo.png")}
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
          {user ? (
            <Link className="navbarLink" to="/contact">
              Contact
            </Link>
          ) : null}
          {user ? (
            <NavDropdown
              drop="down-centered"
              title={
                <img
                  id="userIcon"
                  src={require("../../Assets/Images/User.png")}
                  width={50}
                  height={50}
                  alt="User"
                />
              }
              id="nav-dropdown"
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
              {user.admin ? (
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
