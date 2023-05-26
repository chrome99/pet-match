import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from "./Configs/constants";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { UserContext, IUser } from "./Contexts/UserContext";
import UserRoute from "./Utils/UserRoute";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import MyPets from "./Components/MyPets/MyPets";
import PetProfile from "./Components/Pet/PetProfile";
import Search from "./Components/Search/Search";
import Navbar from "./Components/Navbar/Navbar";
import Dashboard from "./Components/Admin/Dashboard";
import Contact from "./Components/Chat/Contact";
import Faq from "./Components/Faq/Faq";

/*
important:
add readme
add 404 page not found
bottom navbar (copy from other websites)
chat gpt spinner and error (too long message, gpt error)

if i have extra time:
finish all backend todos
general code re-factor re-assment
add dates and unseen messages in chat
add sign in with google?
add user picture (and profile?)
use more populate

*/

export const server = axios.create({
  baseURL: config.API_URL,
});

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

  return (
    <UserContext.Provider value={{ user, changeUser, setLoginModal }}>
      <BrowserRouter>
        <Navbar modal={loginModal} setModal={setLoginModal} />
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route
            path="/mypets"
            element={
              <UserRoute redirectRoute={"/"}>
                <MyPets />
              </UserRoute>
            }
          />
          <Route path="/pet/:id" element={<PetProfile />} />
          <Route
            path="/profile"
            element={
              <UserRoute redirectRoute={"/"}>
                <Profile />
              </UserRoute>
            }
          />
          <Route path="/search" element={<Search />} />
          <Route path="/faq" element={<Faq />} />
          <Route
            path="/contact"
            element={
              <UserRoute redirectRoute={"/"}>
                <Contact />
              </UserRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <UserRoute redirectRoute={"/"} onlyAdmin={true}>
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
