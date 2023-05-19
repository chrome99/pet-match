import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import PetsCollection from "../Search/PetsCollection";
import { IUser, UserContext, UserContextType } from "../UserContext";
import { IPet } from "../Pet/PetProfile";
import { Spinner, Button, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import ManagePetModal from "./Pets/ManagePetModal";
import UsersCollection from "./Users/UsersCollection";
import UserModal from "./Users/UserModal";

function Dashboard() {
  const { user } = useContext(UserContext) as UserContextType;
  const [allPetsList, setAllPetsList] = useState<IPet[] | undefined>(undefined);
  const [usersList, setUsersList] = useState<IUser[] | undefined>(undefined);
  const [managePetModal, setManagePetModal] = useState(false);
  const [modalPet, setModalPet] = useState<IPet | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [modalUser, setModalUser] = useState<IUser | null>(null);

  //pet pagination
  const [petActivePage, setPetActivePage] = useState(1);
  const [petPagesCount, setPetPagesCount] = useState(0);
  const [petSpinner, setPetSpinner] = useState(false);

  //user pagination
  const [userActivePage, setUserActivePage] = useState(1);
  const [userPagesCount, setUserPagesCount] = useState(0);
  const [userSpinner, setUserSpinner] = useState(false);

  function getPets(page: number) {
    setPetSpinner(true);
    axios
      .get(`http://localhost:8080/pet?page=${page}`)
      .then((response) => {
        response.data.result.map((pet: any) => {
          return (pet.id = pet._id);
        });
        setPetActivePage(page);
        setPetPagesCount(Math.ceil(response.data.count / 30)); //30 pets per page
        setAllPetsList(response.data.result);
        setPetSpinner(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getUsers(page: number) {
    if (!user) return;
    setUserSpinner(true);

    axios
      .get(`http://localhost:8080/user?page=${page}`, {
        headers: { admin: user.id, "x-access-token": user.token },
      })
      .then((response) => {
        response.data.result.map((user: any) => {
          return (user.id = user._id);
        });
        setUserActivePage(page);
        setUserPagesCount(Math.ceil(response.data.count / 10)); //10 users per page
        setUsersList(response.data.result);
        setUserSpinner(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getPets(1);
    getUsers(1);
  }, []);

  function updateUserAdmin(userToUpdate: IUser) {
    if (!usersList) return;

    const changedUserIndex = usersList.findIndex(
      (user) => user.id === userToUpdate.id
    );

    const updatedUsersList = [...usersList];
    const targetUser = updatedUsersList[changedUserIndex];
    const updatedUser = { ...targetUser };
    updatedUser.admin = userToUpdate.admin;
    updatedUsersList[changedUserIndex] = updatedUser;
    setUsersList(updatedUsersList);

    if (updatedUser.id === modalUser?.id) {
      setModalUser(updatedUser);
    }
  }

  function updatePet(petToUpdate: IPet) {
    if (!allPetsList) return;

    const changedPetIndex = allPetsList.findIndex(
      (pet) => pet.id === petToUpdate.id
    );

    const updatedPetsList = [...allPetsList];
    const updatedPet = petToUpdate;
    updatedPetsList[changedPetIndex] = updatedPet;
    setAllPetsList(updatedPetsList);
  }

  function addPet(newPet: IPet) {
    if (!allPetsList) return;

    //on the off chance that pets list is empty -
    //(not undefined but empty, meaning there are no pets in the database)
    //set allPetsList to newPet
    setAllPetsList((prev) => {
      if (prev) {
        return [...prev, newPet];
      } else {
        return [newPet];
      }
    });
  }

  return (
    <>
      <div id="dashboardContainer">
        <div className="heading">Admin Dashboard</div>
        <Tabs defaultActiveKey="pets" justify>
          <Tab eventKey="pets" title="Pets">
            <div id="managePets">
              <div id="managePetsHeading">
                <h2>Pets</h2>
                <Button
                  variant="warning"
                  onClick={() => {
                    setModalPet(null);
                    setManagePetModal(true);
                  }}
                >
                  Add Pet
                </Button>
              </div>
              <div className="spinnerDiv">
                <Spinner
                  animation="border"
                  role="status"
                  className={petSpinner ? "" : "d-none"}
                />
              </div>
              {allPetsList ? (
                <PetsCollection
                  pets={allPetsList}
                  onClickFunction={(pet) => {
                    setModalPet(pet);
                    setManagePetModal(true);
                  }}
                  pages={petPagesCount}
                  getMorePets={getPets}
                  activePage={petActivePage}
                />
              ) : (
                ""
              )}
            </div>
          </Tab>
          <Tab eventKey="users" title="Users">
            <div id="manageUsers">
              <div id="manageUsersHeading">
                <h2>Users</h2>
              </div>
              <div className="spinnerDiv">
                <Spinner
                  animation="border"
                  role="status"
                  className={userSpinner ? "" : "d-none"}
                />
              </div>
              {usersList ? (
                <UsersCollection
                  users={usersList}
                  onClickFunction={(user) => {
                    setModalUser(user);
                    setUserModal(true);
                  }}
                  pages={userPagesCount}
                  getMoreUsers={getUsers}
                  activePage={userActivePage}
                />
              ) : (
                ""
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
      <ManagePetModal
        modal={managePetModal}
        setModal={setManagePetModal}
        pet={modalPet}
        updatePet={updatePet}
        addPet={addPet}
      />
      <UserModal
        modal={userModal}
        setModal={setUserModal}
        user={modalUser}
        updateUserAdmin={updateUserAdmin}
      />
    </>
  );
}

export default Dashboard;
