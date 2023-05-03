import React, { useEffect, useContext, useState } from "react";
import "./MyPets.css";
import PetsCollection from "../Search/PetsCollection";
import { IPet } from "../Pet/PetProfile";
import axios from "axios";
import { UserContext, UserContextType } from "../UserContext";
import { Spinner } from "react-bootstrap";

function MyPets() {
  const { user } = useContext(UserContext) as UserContextType;
  const [petsList, setPetsList] = useState<IPet[] | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!user) return;

    if (user.pets.length === 0) {
      setPetsList(null);
      return;
    }

    axios
      .get("http://localhost:8080/petsbyid?ids=" + user.pets.toString())
      .then((response) => {
        response.data.forEach((pet: any) => {
          pet.id = pet._id;
        });
        setPetsList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  return (
    <div id="myPetsContainer">
      <h1>My Pets</h1>
      {petsList === undefined ? ( //if undefined (did not get data from the server yet)
        <div id="myPetsSpinnerDiv">
          <Spinner animation="border" role="status" />
        </div>
      ) : petsList === null ? ( //else if null
        "You currently do not own or foster any pets."
      ) : (
        //else if pets (not undefined and not null)
        <div id="myPetsCollectionContainer">
          <PetsCollection pets={petsList} />
        </div>
      )}
    </div>
  );
}

export default MyPets;
