import React, { useEffect, useContext, useState } from "react";
import "./MyPets.css";
import PetsCollection from "../Search/PetsCollection";
import { IPet } from "../Pet/PetProfile";
import { server } from "../../App";
import { UserContext, UserContextType } from "../../Contexts/UserContext";
import { Spinner, Tabs, Tab } from "react-bootstrap";

function MyPets() {
  const { user } = useContext(UserContext) as UserContextType;
  const [myPetsList, setMyPetsList] = useState<IPet[] | null | undefined>(
    undefined
  );
  const [savedPetsList, setSavedPetsList] = useState<IPet[] | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!user) return;

    if (user.pets.length === 0) {
      setMyPetsList(null);
    } else {
      server
        .get("pet/multiple?ids=" + user.pets.toString())
        .then((response) => {
          response.data.forEach((pet: any) => {
            pet.id = pet._id;
          });
          setMyPetsList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    server
      .get(`wishlist?userId=${user.id}`)
      .then((userWishlist) => {
        if (userWishlist.data.length === 0) {
          setSavedPetsList(null);
          return;
        }
        server
          .get("pet/multiple?ids=" + userWishlist.data.toString())
          .then((petsInWishlist) => {
            petsInWishlist.data.forEach((pet: any) => {
              pet.id = pet._id;
            });
            setSavedPetsList(petsInWishlist.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  return (
    <div id="myPetsContainer">
      <div className="heading">My Pets</div>
      {myPetsList === undefined || savedPetsList === undefined ? ( //if undefined (did not get data from the server yet)
        <div className="spinnerDiv">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Tabs justify id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="myPetsTab" title="My Pets">
            {myPetsList ? (
              <PetsCollection pets={myPetsList} />
            ) : (
              "You currently do not own or foster any pets."
            )}
          </Tab>
          <Tab eventKey="savedPetsTab" title="Saved Pets">
            {savedPetsList ? (
              <PetsCollection pets={savedPetsList} />
            ) : (
              "You currently do not have any saved pets."
            )}
          </Tab>
        </Tabs>
      )}
    </div>
  );
}

export default MyPets;
