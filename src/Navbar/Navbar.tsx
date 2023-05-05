import React, { useState, useContext } from "react";
import "./Navbar.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext, UserContextType } from "../UserContext";
import MyModal from "./Modal/MyModal";

function Navbar() {
  const { user, changeUser } = useContext(UserContext) as UserContextType;
  const [modal, setModal] = useState(false);

  //todo: edit navbar to popout sidebar.

  function logout() {
    changeUser(null);
  }

  return (
    <>
      <div id="myNavbar">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        {user ? (
          <>
            <Link to="/mypets">My Pets</Link>
            <Link to="/profile">Profile</Link>
          </>
        ) : null}
        {user && user.admin ? <Link to="/dashboard">Dashboard</Link> : null}
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
