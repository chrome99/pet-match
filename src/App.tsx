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
add readme
scroll to top on route change (for example at the link in the end of homepage)
update route guard to open login modal if not logged in

css suggestions:
make everything responsive
bottom navbar (copy from other websites)
animal svg loading animation
add spinners where needed
add validation to forms everywhere

Home:
  search section (cat, dog, all pets, use svgs)

petCollection:
  cards using grid, with heart buttons (wishlist), show only name
  use shadows and shadow on hover

search by default should show available pets
add svgs where possible (hearts, pet icon, search icon)
chat: change to accordion

additional suggestions:
use populate


*/

function App() {
  const [user, setUser] = useState<IUser | null>(initUser);

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
    <UserContext.Provider value={{ user, changeUser }}>
      <BrowserRouter>
        <Navbar />
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
