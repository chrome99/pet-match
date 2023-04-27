import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext, UserContextType } from "../UserContext";
import { Button } from "react-bootstrap";
import "./Home.css";

function Home() {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    <>
      <div id="homeContainer">
        <div id="heading">
          {user
            ? `Welcome ${user.firstName} ${user.lastName}!`
            : "Find your new best friend!"}
        </div>
        <div id="infoText">
          Looking to adopt a pet and give a loving home to a furry friend? Pet
          Adoption is here to help! Our platform connects adopters with pets in
          need of a forever home. Our goal is to make pet adoption easy and
          accessible, while also promoting responsible pet ownership.
        </div>
        <Link to="/search">
          <Button variant="primary">Search Pets</Button>
        </Link>
      </div>
    </>
  );
}

export default Home;
