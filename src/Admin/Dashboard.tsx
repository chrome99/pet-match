import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import PetsCollection from "../Search/PetsCollection";
import { UserContext, UserContextType } from "../UserContext";
import { IPet } from "../Pet/PetProfile";
import { Spinner, Button } from "react-bootstrap";
import axios from "axios";
import ManagePetModal from "./ManagePetModal";

function Dashboard() {
  //users collection (opens modal with profile details and pets)

  const { user } = useContext(UserContext) as UserContextType;
  const [allPetsList, setAllPetsList] = useState<IPet[] | null | undefined>(
    undefined
  );
  const [managePetModal, setManagePetModal] = useState(false);
  const [modalPet, setModalPet] = useState<IPet | null | "Pet Edited">(null);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    if (!user) return;

    axios
      .get("http://localhost:8080/pets")
      .then((response) => {
        response.data.map((pet: any) => {
          return (pet.id = pet._id);
        });
        setAllPetsList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user, forceUpdate]);

  useEffect(() => {
    if (modalPet === "Pet Edited") {
      setForceUpdate((prev) => !prev);
      setModalPet(null);
    }
  }, [modalPet]);

  return (
    <>
      <div id="dashboardContainer">
        <h1>Admin Dashboard</h1>
        <div id="managePetsHeading">
          <h2>Pets</h2>
          <Button
            onClick={() => {
              setModalPet(null);
              setManagePetModal(true);
            }}
          >
            Add Pet
          </Button>
        </div>
        {allPetsList === undefined ? ( //if undefined (did not get data from the server yet)
          <div id="AllPetsSpinnerDiv">
            <Spinner animation="border" role="status" />
          </div>
        ) : allPetsList === null ? (
          "There Are Currently No Pets On This Website."
        ) : (
          <div id="allPetsCollection">
            <PetsCollection
              pets={allPetsList}
              onClickFunction={(pet) => {
                setModalPet(pet);
                setManagePetModal(true);
              }}
            />
          </div>
        )}
      </div>
      <ManagePetModal
        modal={managePetModal}
        setModal={setManagePetModal}
        pet={modalPet === "Pet Edited" ? null : modalPet}
        setPet={setModalPet}
      />
    </>
  );
}

export default Dashboard;
