import React, { useEffect, useContext, useState, useRef } from "react";
import "./Chat.css";
import { socket } from "./Socket";
import { UserContext, UserContextType } from "../../Contexts/UserContext";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Request, Message } from "./Contact";

interface ChatProps {
  currentRequest?: Request;
}

function Chat({ currentRequest }: ChatProps) {
  const { user } = useContext(UserContext) as UserContextType;
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const allMessagesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!currentRequest) return;
    setMessages(currentRequest.messages);
  }, [currentRequest]);

  useEffect(() => {
    allMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentRequest]);

  function sendMsg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !currentRequest) return;

    const newMsg: Message = {
      requestId: currentRequest.id,
      userId: user.id,
      userName: user.firstName + " " + user.lastName,
      value: msgInput,
    };
    socket.emit("sendMessage", newMsg);
    if (currentRequest.state === "bot") {
      socket.emit("botAnswer", newMsg);
    }
    setMsgInput("");
  }

  function updateRequest(value: "open" | "closed" | "unattended" | "bot") {
    if (!user || !currentRequest) return;

    socket.emit("changeReqState", {
      id: currentRequest.id,
      adminId: user.id,
      value: value,
    });
  }

  return (
    <div id="chatContainer">
      <div id="chatHeading">
        <h4>{currentRequest?.title}</h4>
        <div
          id="chatHeadingButtons"
          className={
            (user && user.admin) || currentRequest?.state === "bot"
              ? ""
              : "d-none"
          }
        >
          <Button
            className={currentRequest === undefined ? "d-none" : ""}
            variant="warning"
            onClick={
              () =>
                currentRequest?.state === "bot"
                  ? updateRequest("unattended") //bot - transfer request to human admin (unattended)
                  : currentRequest?.state === "open"
                  ? updateRequest("unattended") //open - leave / lock (extra button)
                  : currentRequest?.state === "closed"
                  ? updateRequest("open") //locked - unlock
                  : updateRequest("open") //unattended - engage
            }
          >
            {currentRequest?.state === "bot"
              ? "Talk to a Human"
              : currentRequest?.state === "open"
              ? "Leave"
              : currentRequest?.state === "closed"
              ? "Unlock"
              : "Engage"}
          </Button>
          <Button
            variant="warning"
            className={currentRequest?.state === "open" ? "" : "d-none"}
            onClick={() => updateRequest("closed")}
          >
            Lock
          </Button>
        </div>
      </div>
      <div id="allMessages">
        <img
          id="allMessagesBackground"
          src={require("../../Assets/Images/chat_pattern.jpg")}
          alt="pet pattern"
        />
        {messages.map((message) => {
          return (
            <p
              className={`chatMessage ${
                message.madeBy === "bot"
                  ? "botMessage"
                  : message.madeBy === "other user"
                  ? "receivedMessage"
                  : ""
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
              disabled={
                !currentRequest ||
                currentRequest?.state === "closed" ||
                currentRequest?.state === "unattended"
              }
              type="input"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
            />
            <Button
              variant="warning"
              type="submit"
              disabled={
                !currentRequest ||
                currentRequest?.state === "closed" ||
                currentRequest?.state === "unattended"
              }
            >
              Send
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}

export default Chat;
