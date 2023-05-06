import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import PetsCollection from "../Search/PetsCollection";
import { IUser, UserContext, UserContextType } from "../UserContext";
import { IPet } from "../Pet/PetProfile";
import { Spinner, Button } from "react-bootstrap";
import axios from "axios";
import ManagePetModal from "./ManagePetModal";
import UsersCollection from "./UsersCollection";
import UserModal from "./UserModal";

function Dashboard() {
  //todo: fix change admin not updating bug

  const { user } = useContext(UserContext) as UserContextType;
  const [allPetsList, setAllPetsList] = useState<IPet[] | null | undefined>(
    undefined
  );
  const [usersList, setUsersList] = useState<IUser[] | null | undefined>(
    undefined
  );
  const [managePetModal, setManagePetModal] = useState(false);
  const [modalPet, setModalPet] = useState<IPet | null | "Pet Edited">(null);
  const [userModal, setUserModal] = useState(false);
  const [modalUser, setModalUser] = useState<IUser | null>(null);
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

    axios
      .get("http://localhost:8080/users", {
        headers: { admin: user.id, "x-access-token": user.token },
      })
      .then((response) => {
        response.data.map((user: any) => {
          return (user.id = user._id);
        });
        setUsersList(response.data);
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
        <div id="dashboardHeading">
          <h1>Admin Dashboard</h1>
        </div>
        <div id="petsAndUsersDiv">
          <div id="managePets">
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
          <div id="manageUsers">
            <div id="manageUsersHeading">
              <h2>Users</h2>
            </div>
            {usersList === undefined ? ( //if undefined (did not get data from the server yet)
              <div id="AllUsersSpinnerDiv">
                <Spinner animation="border" role="status" />
              </div>
            ) : usersList === null ? (
              "Error Fetching Data."
            ) : (
              <div id="allUsersCollection">
                <UsersCollection
                  users={usersList}
                  onClickFunction={(user) => {
                    setModalUser(user);
                    setUserModal(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <ManagePetModal
        modal={managePetModal}
        setModal={setManagePetModal}
        pet={modalPet === "Pet Edited" ? null : modalPet}
        setPet={setModalPet}
      />
      <UserModal
        modal={userModal}
        setModal={setUserModal}
        user={modalUser}
        setUser={setModalUser}
      />
    </>
  );
}

export default Dashboard;
