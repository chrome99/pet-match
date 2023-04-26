import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import "./Home.css";
import SignInModal from "./SignInModal";
import LogInModal from "./LogInModal";
import { UserContext, UserContextType } from "../UserContext";

function Home() {
  const [signinModal, setSigninModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const { user, changeUser } = useContext(UserContext) as UserContextType;

  function logout() {
    changeUser(null);
  }

  return (
    <>
      <div id="homeContainer">
        <div id="navbar">
          <Button
            id="signinBtn"
            variant="success"
            className={user ? "d-none" : ""}
            onClick={() => setSigninModal(true)}
          >
            Sign In
          </Button>
          <Button
            id="loginBtn"
            variant="success"
            onClick={() => {
              user ? logout() : setLoginModal(true);
            }}
          >
            {user ? "Log Out" : "Log In"}
          </Button>
        </div>
        <div id="heading">Find your new best friend!</div>
        <div id="infoText">
          Looking to adopt a pet and give a loving home to a furry friend? Pet
          Adoption is here to help! Our platform connects adopters with pets in
          need of a forever home. Our goal is to make pet adoption easy and
          accessible, while also promoting responsible pet ownership.
        </div>
      </div>
      <SignInModal modal={signinModal} setModal={setSigninModal} />
      <LogInModal modal={loginModal} setModal={setLoginModal} />
    </>
  );
}

export default Home;
