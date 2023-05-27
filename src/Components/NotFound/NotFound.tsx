import React from "react";
import "./NotFound.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div id="notFoundContainer">
      <img
        src={require("../../Assets/Images/404.jpg")}
        alt="404: page not found"
        width="750"
        height="500"
      />
      <Link to="/">
        <Button variant="outline-warning">Go Back Home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
