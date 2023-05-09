import React, { useEffect, useState, useContext } from "react";
import "./Contact.css";
import ChatsMenu from "./ChatsMenu";
import Chat from "./Chat";
import axios from "axios";
import { UserContext, UserContextType } from "../UserContext";
import { Spinner } from "react-bootstrap";

export type Request = {
  id: string;
  title: string;
  userId: string;
  state: "open" | "closed" | "unattended";
  senderName?: string;
};

function Contact() {
  // todo: quick update for request state using sockets

  const { user } = useContext(UserContext) as UserContextType;

  const [requests, setRequests] = useState<Request[] | null | undefined>(
    undefined
  );
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);

  useEffect(() => {
    if (!user) return;

    axios
      .get(
        `http://localhost:8080/${user.admin ? "requestadmin" : "request"}/${
          user.id
        }`,
        {
          headers: {
            admin: user.admin ? user.id : "",
            "x-access-token": user.token,
          },
        }
      )
      .then((response) => {
        response.data.map((request: any) => {
          return (request.id = request._id);
        });
        setRequests((prev) => {
          if (prev) {
            return [...prev, ...response.data];
          } else {
            return response.data;
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });

    //only get all unattended requests for admins
    if (!user.admin) {
      return;
    }

    axios
      .get("http://localhost:8080/unattendedrequest", {
        headers: {
          admin: user.admin ? user.id : "",
          "x-access-token": user.token,
        },
      })
      .then((response) => {
        response.data.map((request: any) => {
          return (request.id = request._id);
        });
        setRequests((prev) => {
          if (prev) {
            return [...prev, ...response.data];
          } else {
            return response.data;
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  function updateCurrentRequest(value: "open" | "closed" | "unattended") {
    if (!currentRequest || !requests) return;

    //find index
    const currentRequestIndex = requests.findIndex(
      (request) => request.id === currentRequest.id
    );
    //if index found
    if (currentRequestIndex !== -1) {
      //create updated version of current request
      const newCurrentRequest = {
        ...requests[currentRequestIndex],
        state: value,
      };
      //create new requests with updated request
      const newRequests = [
        ...requests.slice(0, currentRequestIndex),
        newCurrentRequest,
        ...requests.slice(currentRequestIndex + 1),
      ];
      //set requests to new requests
      setRequests(newRequests);
    } else {
      throw new Error("currentRequest not found");
    }
  }

  return (
    <div id="contactContainer">
      <h1 id="contactHeading">Contact</h1>
      {requests === undefined ? (
        <Spinner animation="border" role="status" />
      ) : (
        <div id="chatsMenuAndChatContainer">
          <ChatsMenu
            requests={requests}
            setRequests={setRequests}
            setCurrentRequest={setCurrentRequest}
          />
          {currentRequest ? (
            <Chat
              currentRequest={currentRequest}
              updateCurrentRequest={updateCurrentRequest}
            />
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}

export default Contact;
