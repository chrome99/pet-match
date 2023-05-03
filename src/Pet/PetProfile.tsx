import React, { useContext, useEffect, useState } from "react";
import "./PetProfile.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spinner, Button, Alert } from "react-bootstrap";
import { UserContext, UserContextType } from "../UserContext";

export type IPet = {
  id: string;
  type: string;
  name: string;
  adoptionStatus: "Fostered" | "Adopted" | "Available";
  picture: string;
  height: number;
  weight: number;
  color: string;
  bio: string;
  hypoallergnic: boolean;
  dietery: string[];
  breed: string;
};

function PetProfile() {
  const [pet, setPet] = useState<IPet | null>(null);
  const { id } = useParams();
  const { user, changeUser } = useContext(UserContext) as UserContextType;

  const [alert, setAlert] = useState("");
  const [wishlisted, setWishlisted] = useState(false);
  const [fostered, setFostered] = useState(false);
  const [adopted, setAdopted] = useState(false);
  const [petBtns, setPetBtns] = useState(false);

  useEffect(() => {
    //  This useEffect will run on mount and after the transactPet function
    //  (because pet transactions change the user, and user is one of the dependencies).
    //  That's how the pet's adoption status is updated!

    axios
      .get("http://localhost:8080/pet/" + id)
      .then((response) => {
        response.data.id = response.data._id;

        setPet(response.data);
        if (!user) return;
        if (user.pets.includes(id as string)) {
          if (response.data.adoptionStatus === "Fostered") {
            setFostered(true);
          } else if (response.data.adoptionStatus === "Adopted") {
            setAdopted(true);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, user]);

  //this use effect runs after we get the pet from the database
  useEffect(DidUserWishlistPet, [pet]);

  function transactPet(type: "adopt" | "foster", value: boolean) {
    if (!user) return;

    setPetBtns(false);
    axios
      .post(
        `http://localhost:8080/pet/${id}/adopt`,
        { type: type, value: value },
        {
          headers: { "x-access-token": user.token },
        }
      )
      .then((response) => {
        if (type === "adopt") {
          setAdopted(value);
          setFostered(false);
        } else if (type === "foster") {
          setFostered(value);
          setAdopted(false);
        }

        const newUser = { ...user };
        newUser.pets = response.data.pets;
        changeUser(newUser);
        setPetBtns(true);
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
        setPetBtns(true);
      });
  }

  function DidUserWishlistPet() {
    if (!user || !pet) return;

    axios
      .get(`http://localhost:8080/wishlist?userId=${user.id}`)
      .then((response) => {
        const userWishlist: string[] = response.data;
        const result = userWishlist.includes(pet.id);
        setWishlisted(result);
        setPetBtns(true);
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
        setWishlisted(false);
        setPetBtns(true);
      });
  }

  function addToWishlist() {
    if (!user || !pet) return;
    setPetBtns(false);

    axios
      .post("http://localhost:8080/wishlist", {
        userId: user.id,
        petId: pet.id,
      })
      .then(() => {
        setWishlisted(true);
        setPetBtns(true);
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
        setPetBtns(true);
      });
  }

  function removeFromWishlist() {
    if (!user || !pet) return;
    setPetBtns(false);

    axios
      .delete(
        `http://localhost:8080/wishlist?userId=${user.id}&petId=${pet.id}`
      )
      .then(() => {
        setWishlisted(false);
        setPetBtns(true);
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
        setPetBtns(true);
      });
  }

  return (
    <>
      {pet ? (
        <div id={id} className="petContainer">
          <img id="petImg" src={pet.picture} alt={pet.name} />
          <h1>{pet.name}</h1>
          <div id="petInfo">
            <div>Adoption Status: {pet.adoptionStatus}</div>
            <div>Type: {pet.type}</div>
            <div>Breed: {pet.breed}</div>
            <div>Color: {pet.color}</div>
            <div>Height: {pet.height}</div>
            <div>Weight: {pet.weight}</div>
            <div>Bio: {pet.bio ? pet.bio : "None"}</div>
            <div>Hypoallergnic: {pet.hypoallergnic ? "Yes" : "No"}</div>
            <div>
              Dietary Restrictions:{" "}
              {pet.dietery.length > 0 ? pet.dietery : "None"}
            </div>
          </div>

          {petBtns && user ? (
            <div id="petButtons">
              <Button onClick={wishlisted ? removeFromWishlist : addToWishlist}>
                {wishlisted ? "Remove From Wishlist" : "Add To Wishlist"}
              </Button>
              <Button
                className={adopted ? "d-none" : ""}
                onClick={transactPet.bind(null, "foster", !fostered)}
              >
                {/* unfoster : foster */}
                {fostered ? "Return" : "Foster"}
              </Button>
              <Button onClick={transactPet.bind(null, "adopt", !adopted)}>
                {/* unadopt : adopt */}
                {adopted ? "Return" : "Adopt"}
              </Button>
            </div>
          ) : user ? ( // if user true and petBtns false
            <Spinner animation="border" role="status" />
          ) : //if user null and petBtns false
          null}
          <Alert
            className="mb-0"
            variant="danger"
            dismissible={true}
            show={alert ? true : false}
            onClose={() => setAlert("")}
          >
            {alert}
          </Alert>
        </div>
      ) : (
        <div id="petSpinnerDiv">
          <Spinner animation="border" role="status" />
        </div>
      )}
    </>
  );
}

export default PetProfile;
