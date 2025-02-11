import React, { useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";

function Footer() {
  const [footerInput, setFooterInput] = useState("");
  //   home, search, faq, contact, profile, my pets

  return (
    <div id="footerContainer">
      <footer className="w-100 py-4 flex-shrink-0">
        <div className="container py-4">
          <div className="row gy-4 gx-5">
            <div className="col-lg-4 col-md-6">
              <h5 className="text-white h1">PET MATCH</h5>
              <p className="small text-muted">
                Pet Match is an online platform dedicated to helping animals
                find their forever homes. We strive to connect adoptable pets
                with loving families, providing a seamless adoption process for
                pet owners.
              </p>
              <p className="small text-muted mb-0">
                &copy; 2023, All Rights Reserved{" "}
                <a href="https://github.com/chrome99" className="text-primary">
                  Chrome99.
                </a>
              </p>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="footerHeading mb-3">Quick links</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/search">Search</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/mypets">My Pets</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="footerHeading mb-3">Quick Info</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/404">Secret 404 page</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-6">
              <h5 className="footerHeading mb-3">Newsletter</h5>
              <p className="small text-muted">
                To get the lastest interesting news and events on pet adoption,
                sign up for the Pet Match newsletter (currently in production).
              </p>
              <Form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  setFooterInput("");
                }}
              >
                <InputGroup>
                  <Form.Control
                    value={footerInput}
                    onChange={(e) => setFooterInput(e.target.value)}
                    type="email"
                    placeholder="Your email..."
                  />
                  <Button variant="warning" type="submit">
                    <img
                      src={require("../../Assets/Images/send.png")}
                      alt="send"
                      width="25"
                      height="25"
                    />
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
