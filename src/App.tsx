import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { UserContext, IUser } from "./UserContext";
import UserRoute from "./UserRoute";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import MyPets from "./MyPets/MyPets";
import PetProfile from "./Pet/PetProfile";
import Search from "./Search/Search";
import Navbar from "./Navbar/Navbar";
import Dashboard from "./Admin/Dashboard";
import Contact from "./Chat/Contact";
import Faq from "./Faq/Faq";

/*
important:
organize backend
deploy

less important:
fix force updates (2) in dashboard 
add pagination to petsCollection, also use shadows and shadow on hover
bottom navbar (copy from other websites)
update route guard to open login modal if not logged in

additional suggestions:
add readme
use more populate

*/

function App() {
  const [user, setUser] = useState<IUser | null>(initUser);
  const [loginModal, setLoginModal] = useState(false);

  function initUser() {
    if (localStorage.user) {
      const foundUser = JSON.parse(localStorage.user);
      return foundUser;
    }
    return null;
  }

  function changeUser(value: IUser | null) {
    setUser(value);
    localStorage.user = JSON.stringify(value);
  }

  function openModal() {
    setLoginModal(true);
  }

  return (
    <UserContext.Provider value={{ user, changeUser }}>
      <BrowserRouter>
        <Navbar modal={loginModal} setModal={setLoginModal} />
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route
            path="/mypets"
            element={
              <UserRoute redirectRoute={"/"} openModal={openModal}>
                <MyPets />
              </UserRoute>
            }
          />
          <Route path="/pet/:id" element={<PetProfile />} />
          <Route
            path="/profile"
            element={
              <UserRoute redirectRoute={"/"} openModal={openModal}>
                <Profile />
              </UserRoute>
            }
          />
          <Route path="/search" element={<Search />} />
          <Route path="/faq" element={<Faq />} />
          <Route
            path="/contact"
            element={
              <UserRoute redirectRoute={"/"} openModal={openModal}>
                <Contact />
              </UserRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <UserRoute
                redirectRoute={"/"}
                onlyAdmin={true}
                openModal={openModal}
              >
                <Dashboard />
              </UserRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
