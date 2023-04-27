import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { UserContext, IUser } from "./UserContext";
import UserRoute from "./UserRoute";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import Pets from "./Pets/Pets";
import Search from "./Search/Search";
import Navbar from "./Navbar/Navbar";

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
            path="/pets"
            element={
              <UserRoute redirectRoute={"/"}>
                <Pets />
              </UserRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <UserRoute redirectRoute={"/"}>
                <Profile />
              </UserRoute>
            }
          />
          <Route path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
