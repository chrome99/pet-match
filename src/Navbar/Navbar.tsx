import React, { useState, useContext } from "react";
import "./Navbar.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext, UserContextType } from "../UserContext";
import MyModal from "./Modal/MyModal";

function Navbar() {
  const { user, changeUser } = useContext(UserContext) as UserContextType;
  const [modal, setModal] = useState(false);

  function logout() {
    changeUser(null);
  }

  return (
    <>
      <div id="myNavbar">
        <Link to="/">Home</Link>
        <Link to="/pets">Pets</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/search">Search</Link>
        <Button
          id="loginBtn"
          variant="success"
          size="sm"
          onClick={() => {
            user ? logout() : setModal(true);
          }}
        >
          {user ? "Log Out" : "Log In"}
        </Button>
      </div>
      <MyModal modal={modal} setModal={setModal} />
    </>
  );
}

export default Navbar;
