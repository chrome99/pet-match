import React, { useEffect, useContext, useState, useRef } from "react";
import "./Chat.css";
import { socket } from "./Socket";
import { UserContext, UserContextType } from "../UserContext";
import { Form, Button, InputGroup } from "react-bootstrap";
import axios from "axios";
import { Request } from "./Contact";

type Message = {
  id?: string;
  _id?: string;
  requestId: string;
  userId: string;
  userName: string;
  value: string;
  madeByUser?: boolean;
  createdAt?: Date;
};

interface ChatProps {
  currentRequest: Request;
  updateCurrentRequest: Function;
}

function Chat({ currentRequest, updateCurrentRequest }: ChatProps) {
  const { user } = useContext(UserContext) as UserContextType;
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const allMessagesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    function fetchData() {
      if (!user) return;

      axios
        .get("http://localhost:8080/messages/" + currentRequest.id, {
          headers: { "x-access-token": user.token },
        })
        .then((response) => {
          response.data.map((message: any) => {
            const newMessage = message;
            newMessage.id = message._id;
            newMessage.madeByUser = message.userId === user.id;
            if (newMessage.createdAt) {
              newMessage.createdAt = new Date(message.createdAt.toString());
            }
            return newMessage;
          });
          const sender = response.data.findLast(
            (message: any) => message.userId !== user.id
          );
          if (sender) {
            currentRequest.senderName = sender.userName;
          }
          setMessages(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function onNewMsg(message: Message) {
      if (!user) return;
      if (currentRequest.senderName === undefined) {
        currentRequest.senderName = message.userName;
      }

      message.id = message._id;
      message.madeByUser = message.userId === user.id;
      if (message.createdAt) {
        message.createdAt = new Date(message.createdAt.toString());
      }
      setMessages((messages) => [...messages, message]);
    }

    fetchData();

    socket.connect();

    socket.emit("joinRoom", currentRequest.id);

    socket.on("sendMessage", onNewMsg);

    return () => {
      socket.off("sendMessage", onNewMsg);
      socket.disconnect();
    };
  }, [currentRequest, user]);

  useEffect(() => {
    allMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMsg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const newMsg: Message = {
      requestId: currentRequest.id,
      userId: user.id,
      userName: user.firstName + " " + user.lastName,
      value: msgInput,
    };
    socket.emit("sendMessage", newMsg);
    setMsgInput("");
  }

  function updateRequest(value: "open" | "closed" | "unattended") {
    if (!user) return;

    axios
      .put(
        "http://localhost:8080/request",
        {
          id: currentRequest.id,
          adminId: user.id,
          value: value,
        },
        {
          headers: { admin: user.id, "x-access-token": user.token },
        }
      )
      .then((response) => {
        currentRequest.state = value;
        updateCurrentRequest(value);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div id="chatContainer">
      <div id="chatHeading">
        <h4>
          {currentRequest.senderName
            ? "With: " + currentRequest.senderName.toString()
            : ""}
        </h4>
        <div
          id="chatHeadingButtons"
          className={user && user.admin ? "" : "d-none"}
        >
          <Button
            onClick={
              () =>
                currentRequest.state === "open"
                  ? updateRequest("unattended") //open - leave / lock (extra button)
                  : currentRequest.state === "closed"
                  ? updateRequest("open") //locked - unlock
                  : updateRequest("open") //unattended - engage
            }
          >
            {currentRequest.state === "open"
              ? "Leave"
              : currentRequest.state === "closed"
              ? "Unlock"
              : "Engage"}
          </Button>
          <Button
            className={currentRequest.state === "open" ? "" : "d-none"}
            onClick={() => updateRequest("closed")}
          >
            Lock
          </Button>
        </div>
      </div>
      <div id="allMessages">
        {messages.map((message) => {
          return (
            <p
              className={`chatMessage ${
                message.madeByUser === false ? "receivedMessage" : ""
              }`}
              key={message.id}
            >
              <span className="chatMessageDate">
                {message.createdAt?.getHours().toString().padStart(2, "0") +
                  ":" +
                  message.createdAt?.getMinutes().toString().padStart(2, "0")}
              </span>
              {message.value}
            </p>
          );
        })}
        <div ref={allMessagesRef} />
      </div>
      <div id="chatForm">
        <Form onSubmit={sendMsg}>
          <InputGroup>
            <Form.Control
              disabled={currentRequest.state !== "open"}
              type="input"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
            />
            <Button type="submit" disabled={currentRequest.state !== "open"}>
              Send
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}

export default Chat;
