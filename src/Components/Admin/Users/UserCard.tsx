import React from "react";
import "./UserCard.css";
import { IUser } from "../../../Contexts/UserContext";

interface UserCardProps {
  user: IUser;
  onClickFunction?: (user: IUser) => void;
}
function UserCard({ user, onClickFunction }: UserCardProps) {
  return (
    <>
      <div
        id={user.id}
        className="userCard"
        onClick={onClickFunction ? () => onClickFunction(user) : undefined}
      >
        <span
          className={user.admin ? "userCardAdmin" : ""}
        >{`${user.firstName} ${user.lastName} | ${user.pets.length} Pets`}</span>
      </div>
    </>
  );
}

export default UserCard;
