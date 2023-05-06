import React, { useState } from "react";
import "./UsersCollection.css";
import { IUser } from "../UserContext";
import UserCard from "./UserCard";

interface UsersCollectionProps {
  users: IUser[];
  onClickFunction?: (user: IUser) => void;
}

function UsersCollection({ users, onClickFunction }: UsersCollectionProps) {
  return (
    <div id="usersCollectionContainer">
      {users.map((user) => {
        return (
          <UserCard
            user={user}
            key={user.id}
            onClickFunction={onClickFunction}
          />
        );
      })}
    </div>
  );
}

export default UsersCollection;
