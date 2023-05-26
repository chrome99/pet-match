import React, { useEffect, useState, useContext } from "react";
import "./Contact.css";
import ChatsMenu from "./ChatsMenu";
import Chat from "./Chat";
import { server } from "../../App";
import { UserContext, UserContextType } from "../../Contexts/UserContext";
import { Spinner } from "react-bootstrap";
import { socket } from "./Socket";

export type Request = {
  id: string;
  _id?: string;
  title: string;
  userId: string;
  state: "open" | "closed" | "unattended" | "bot";
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export type Message = {
  id?: string;
  _id?: string;
  requestId: string;
  userId: string;
  userName: string;
  value: string;
  madeBy?: "user" | "other user" | "bot";
  createdAt?: Date;
};

interface ChangeReqState {
  id: string;
  adminId: string;
  value: "open" | "closed" | "unattended" | "bot";
}

function Contact() {
  const { user } = useContext(UserContext) as UserContextType;

  const [requests, setRequests] = useState<Request[] | null | undefined>(
    undefined
  );
  const [currentRequest, setCurrentRequest] = useState<Request | undefined>(
    undefined
  );

  useEffect(() => {
    async function getData() {
      if (!user) return;

      try {
        const response = await server.get(
          `request${user.admin ? "/admin" : ""}/${user.id}`,
          {
            headers: {
              admin: user.admin ? user.id : "",
              "x-access-token": user.token,
            },
          }
        );
        const userResult = response.data.map((req: Request) => {
          return parseRequest(req, user.id);
        });

        if (!user.admin) {
          setRequests(userResult);
          return;
        }

        const adminResponse = await server.get("request/unattended", {
          headers: {
            admin: user.admin ? user.id : "",
            "x-access-token": user.token,
          },
        });
        const adminResult = adminResponse.data.map((req: Request) => {
          return parseRequest(req, user.id);
        });
        setRequests([...userResult, ...adminResult]);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [user]);

  function addRequest(req: Request) {
    if (!user) return;
    const parsedReq = parseRequest(req, user.id);
    setRequests((prev) => {
      if (prev) {
        return [...prev, parsedReq];
      } else {
        return [parsedReq];
      }
    });
    //if this new request came from the user, then set current request to this new request
    if (parsedReq.userId === user.id) {
      setCurrentRequest(parsedReq);
    }
  }

  function parseRequest(newRequest: Request, userId: string) {
    const parsedMessages = newRequest.messages.map((msg) => {
      return parseMessage(msg, userId);
    });

    const parsedRequest: Request = { ...newRequest }; //shallow clone because unparsed messages are unimportant anyway
    parsedRequest.id = parsedRequest._id as string;
    parsedRequest.createdAt = new Date(parsedRequest.createdAt);
    parsedRequest.updatedAt = new Date(parsedRequest.updatedAt);
    parsedRequest.messages = parsedMessages;
    return parsedRequest;
  }

  function parseMessage(newMsg: Message, userId: string) {
    const parsedMsg: Message = { ...newMsg };
    parsedMsg.id = parsedMsg._id;
    switch (parsedMsg.userId) {
      case "646e1ec676f95c539fe79f48": //bot user id
        parsedMsg.madeBy = "bot";
        break;
      case userId:
        parsedMsg.madeBy = "user";
        break;
      default:
        parsedMsg.madeBy = "other user";
    }
    if (parsedMsg.createdAt) {
      parsedMsg.createdAt = new Date(parsedMsg.createdAt.toString());
    }

    return parsedMsg;
  }

  useEffect(() => {
    if (!user || !requests) return;
    //update messages

    function onNewMsg(message: Message) {
      if (!requests || !user) return;

      message = parseMessage(message, user.id);

      //find index
      const requestIndex = requests.findIndex(
        (request) => request.id === message.requestId
      );
      if (requestIndex === -1) return;

      const updatedRequests = [...requests];
      const targetRequest = updatedRequests[requestIndex];
      const updatedRequest = { ...targetRequest };
      updatedRequest.messages.push(message);
      updatedRequest.updatedAt = new Date();
      updatedRequests[requestIndex] = updatedRequest;
      setRequests(updatedRequests);

      if (message.requestId === currentRequest?.id) {
        setCurrentRequest(updatedRequest);
      }
    }

    function onNewRequest(request: Request) {
      //new requests can come from 2 sources:
      //1) a new request a regular non-admin user himself makes
      //2) an existing request that changed state from "bot" to "open", and is therefore sent to admins listening on "adminsRoom"
      addRequest(request);
    }

    function onChangeReqState(changedRequest: ChangeReqState) {
      if (!requests) return;

      const changedRequestIndex = requests.findIndex(
        (req) => req.id === changedRequest.id
      );

      const updatedRequests = [...requests];
      const targetRequest = updatedRequests[changedRequestIndex];
      const updatedRequest = { ...targetRequest };
      updatedRequest.state = changedRequest.value;
      updatedRequest.updatedAt = new Date();
      updatedRequests[changedRequestIndex] = updatedRequest;
      setRequests(updatedRequests);

      if (changedRequest.id === currentRequest?.id) {
        setCurrentRequest(updatedRequest);
      }
    }

    function onError(value: string) {
      alert(value);
    }

    socket.connect();

    const requestsIds = requests.map((request) => {
      return request.id;
    });
    socket.emit("joinRoom", requestsIds);

    //also listen to user.id room, to get new requests that the user makes.
    socket.emit("joinRoom", user.id);

    //if admin, also listen to adminsRoom, to get new unattended requests
    if (user.admin) {
      socket.emit("joinRoom", "adminsRoom");
    }

    socket.on("sendMessage", onNewMsg);
    socket.on("botAnswer", onNewMsg);
    socket.on("newRequest", onNewRequest);
    socket.on("changeReqState", onChangeReqState);
    socket.on("error", onError);

    return () => {
      socket.off("sendMessage", onNewMsg);
      socket.off("botAnswer", onNewMsg);
      socket.off("newRequest", onNewRequest);
      socket.on("error", onError);
      socket.off("changeReqState", onChangeReqState);
      socket.disconnect();
    };
  }, [requests, currentRequest]);

  return (
    <div id="contactContainer">
      <div className="heading">Contact</div>
      {requests === undefined ? (
        <div className="spinnerDiv">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div id="chatsMenuAndChatContainer">
          <ChatsMenu
            requests={requests}
            setCurrentRequest={setCurrentRequest}
          />
          <Chat currentRequest={currentRequest} />
        </div>
      )}
    </div>
  );
}

export default Contact;
