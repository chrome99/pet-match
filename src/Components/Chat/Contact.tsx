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
  title: string;
  userId: string;
  state: "open" | "closed" | "unattended";
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
  madeByUser?: boolean;
  createdAt?: Date;
};

interface ChangeReqState {
  id: string;
  adminId: string;
  value: "open" | "closed" | "unattended";
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
        response.data.forEach((req: any, i: number, reqs: any) => {
          reqs[i].id = reqs[i]._id;
          reqs[i].createdAt = new Date(reqs[i].createdAt);
          reqs[i].updatedAt = new Date(reqs[i].updatedAt);
          reqs[i].messages.forEach((msg: Message, j: number, msgs: any) => {
            msgs[j].id = msgs[j]._id;
            msgs[j].madeByUser = msgs[j].userId === user.id;
            if (msgs[j].createdAt) {
              msgs[j].createdAt = new Date(msgs[j].createdAt.toString());
            }
          });
        });

        if (!user.admin) {
          setRequests(response.data);
          return;
        }

        const adminResponse = await server.get("request/unattended", {
          headers: {
            admin: user.admin ? user.id : "",
            "x-access-token": user.token,
          },
        });
        console.log(adminResponse);
        adminResponse.data.forEach((req: any, i: number, reqs: any) => {
          reqs[i].id = reqs[i]._id;
          reqs[i].createdAt = new Date(reqs[i].createdAt);
          reqs[i].updatedAt = new Date(reqs[i].updatedAt);
          reqs[i].messages.forEach((msg: Message, j: number, msgs: any) => {
            msgs[j].id = msgs[j]._id;
            msgs[j].madeByUser = msgs[j].userId === user.id;
            if (msgs[j].createdAt) {
              msgs[j].createdAt = new Date(msgs[j].createdAt.toString());
            }
          });
        });
        setRequests([...response.data, ...adminResponse.data]);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [user]);

  function addRequest(req: Request) {
    if (!user) return;
    req.createdAt = new Date(req.createdAt);
    req.updatedAt = new Date(req.updatedAt);
    req.messages[0].id = req.messages[0]._id;
    req.messages[0].madeByUser = req.messages[0].userId === user.id;
    if (req.messages[0].createdAt) {
      req.messages[0].createdAt = new Date(
        req.messages[0].createdAt.toString()
      );
    }
    setRequests((prev) => {
      if (prev) {
        return [...prev, req];
      } else {
        return [req];
      }
    });
  }

  useEffect(() => {
    if (!user || !requests) return;
    //update messages

    function onNewMsg(message: Message) {
      if (!requests || !user) return;

      message.id = message._id;
      message.madeByUser = message.userId === user.id;
      if (message.createdAt) {
        message.createdAt = new Date(message.createdAt.toString());
      }

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

    function onNewRequest(data: any) {
      data.id = data._id;
      addRequest(data);
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

    socket.connect();

    const requestsIds = requests.map((request) => {
      return request.id;
    });
    socket.emit("joinRoom", requestsIds);

    socket.on("sendMessage", onNewMsg);
    socket.on("newRequest", onNewRequest);
    socket.on("changeReqState", onChangeReqState);

    return () => {
      socket.off("sendMessage", onNewMsg);
      socket.off("newRequest", onNewRequest);
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
