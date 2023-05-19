import React, { useRef } from "react";
import "./UsersCollection.css";
import { IUser } from "../../UserContext";
import UserCard from "./UserCard";
import { Pagination } from "react-bootstrap";

interface UsersCollectionProps {
  users: IUser[];
  onClickFunction?: (user: IUser) => void;
  pages: number;
  getMoreUsers: (page: number) => void;
  activePage: number;
}

function UsersCollection({
  users,
  onClickFunction,
  pages,
  getMoreUsers,
  activePage,
}: UsersCollectionProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const items = [];
  if (pages) {
    for (let pageNum = 1; pageNum <= pages; pageNum++) {
      items.push(
        <Pagination.Item
          key={pageNum}
          active={pageNum === activePage}
          onClick={
            getMoreUsers
              ? () => {
                  getMoreUsers(pageNum);
                  topRef.current?.scrollIntoView({ behavior: "smooth" });
                }
              : undefined
          }
        >
          {pageNum}
        </Pagination.Item>
      );
    }
  }

  return (
    <div id="usersCollectionContainer">
      <div ref={topRef} />
      {pages ? (
        <div className="paginationContainer">
          <Pagination>{items}</Pagination>
        </div>
      ) : (
        ""
      )}
      {users.map((user) => {
        return (
          <UserCard
            user={user}
            key={user.id}
            onClickFunction={onClickFunction}
          />
        );
      })}
      <div ref={topRef} />
      {pages ? (
        <div className="paginationContainer">
          <Pagination>{items}</Pagination>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default UsersCollection;
