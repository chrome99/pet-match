import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div id="myNavbar">
      <Link to="/">Home</Link>
      <Link to="/pets">Pets</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/search">Search</Link>
    </div>
  );
}

export default Navbar;
