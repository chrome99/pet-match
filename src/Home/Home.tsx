import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext, UserContextType } from "../UserContext";
import { Button, Spinner } from "react-bootstrap";
import PetsCollection from "../Search/PetsCollection";
import PetsCarousel from "../Search/PetsCarousel";
import "./Home.css";
import axios from "axios";
import { IPet } from "../Pet/PetProfile";

function Home() {
  const { user } = useContext(UserContext) as UserContextType;
  const [currentImg, setCurrentImg] = useState(1);
  const [recentPets, setRecentPets] = useState<IPet[] | null | undefined>(
    undefined
  );

  useEffect(() => {
    axios
      .get("http://localhost:8080/recentpets?limit=6")
      .then((response) => {
        response.data.map((pet: any) => {
          return (pet.id = pet._id);
        });
        setRecentPets(response.data);
      })
      .catch((error) => {
        setRecentPets(null);
        console.log(error);
      });

    const changePictureInterval = setInterval(() => {
      setCurrentImg((prev) => {
        if (prev === 2) {
          //^^^max number of imgs
          return 1;
        } else return prev + 1;
      });
    }, 10000);
    return () => {
      clearInterval(changePictureInterval);
    };
  }, []);

  return (
    <>
      <div id="welcomeContainer">
        <img
          id="HomeBackgroundImg_1"
          className={`HomeBackgroundImg ${
            currentImg === 1 ? "currentBackgroundImg" : ""
          }`}
          src={require("../Images/Homepage_1.jpg")}
          alt=""
        />
        <img
          id="HomeBackgroundImg_2"
          className={`HomeBackgroundImg ${
            currentImg === 2 ? "currentBackgroundImg" : ""
          }`}
          src={require("../Images/Homepage_2.jpg")}
          alt=""
        />
        <div className="heading">Meet your purrfect match.</div>
        <div className="infoText">
          Looking to adopt a pet and give a loving home to a furry friend? Pet
          Adoption is here to help! Our platform connects adopters with pets in
          need of a forever home.
        </div>
        <Link to="/search">
          <Button variant="warning">Search Pets</Button>
        </Link>
      </div>
      <div id="recentPetsContainer">
        <img
          id="recentPetsImg"
          src={require("../Images/pet_pattern.jpg")}
          alt="pet pattern"
        />
        <div className="heading">Meet our newest pets.</div>
        {recentPets === undefined ? (
          <div className="spinnerDiv">
            <Spinner animation="border" role="status" />
          </div>
        ) : recentPets === null ? (
          ""
        ) : (
          <PetsCarousel pets={recentPets} />
        )}
      </div>
      <div id="homeContactContainer">
        <div className="heading">Make a commitment.</div>
        <div id="homeFaq">
          <img src={require("../Images/Chat.png")} alt="Chat" />
          <div className="infoText">
            Make a commitment to your success by exploring our{" "}
            <Link to="/faq" className="navbarLink">
              frequently asked questions
            </Link>{" "}
            (FAQ) section. We understand that starting something new can be
            daunting, so we've compiled a list of answers to common questions
            about our services. You'll find information on pricing, features,
            and how to get started.
          </div>
        </div>
        <div id="homeChat">
          <img src={require("../Images/Faq.png")} alt="Chat" />
          <div className="infoText">
            Making a commitment has never been easier with our chat system.
            Whether you have a question, feedback, or need assistance, our team
            is{" "}
            <Link to="/contact" className="navbarLink">
              just a click away.
            </Link>{" "}
            We're committed to providing you with exceptional customer service
            and helping you find your perfect match.
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
