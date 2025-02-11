import React, { useEffect, useContext, useState, useRef } from "react";
import "./Chat.css";
import { socket } from "./Socket";
import { UserContext, UserContextType } from "../../Contexts/UserContext";
import { Form, Button, InputGroup, Spinner, Alert } from "react-bootstrap";
import { Request, Message } from "./Contact";

interface ChatProps {
  currentRequest?: Request;
}

function Chat({ currentRequest }: ChatProps) {
  const { user } = useContext(UserContext) as UserContextType;
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState("");

  const [botSpinner, setBotSpinner] = useState(false);
  const [alert, setAlert] = useState("");

  const allMessagesRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (!currentRequest) return;
    setMessages(currentRequest.messages);
  }, [currentRequest]);

  useEffect(() => {
    const { scrollX, scrollY } = window;
    allMessagesRef.current?.scrollIntoView(false);
    window.scrollTo(scrollX, scrollY);
  }, [messages, currentRequest]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (alert) {
      timer = setTimeout(() => {
        setAlert("");
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [alert]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (botSpinner) {
      timer = setTimeout(() => {
        setAlert("Error: Bot Timeout.");
        setBotSpinner(false);
      }, 10000);
    } else {
      //input is now available, so focus on input
      inputRef.current?.focus();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [botSpinner]);

  useEffect(() => {
    function onBotError(err: string) {
      setAlert("Error: " + err);
      setBotSpinner(false);
    }
    function onBotAnswer() {
      setAlert("");
      setBotSpinner(false);
    }

    socket.on("botError", onBotError);
    socket.on("botAnswer", onBotAnswer);

    return () => {
      socket.off("botError", onBotError);
      socket.off("botAnswer", onBotAnswer);
      socket.disconnect();
    };
  }, []);

  function sendMsg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (msgInput.length > 500) return;
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
      setBotSpinner(true);
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
        <div className="botSpinner">
          <Alert variant="danger" show={alert ? true : false}>
            {alert}
          </Alert>
          <Spinner
            animation="grow"
            variant="success"
            role="status"
            className={botSpinner ? "" : "d-none"}
          />
        </div>
        <div ref={allMessagesRef} />
      </div>
      <div id="chatForm">
        <Form onSubmit={sendMsg}>
          <InputGroup>
            <Form.Control
              disabled={
                !currentRequest ||
                currentRequest?.state === "closed" ||
                currentRequest?.state === "unattended" ||
                botSpinner
              }
              type="input"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              ref={inputRef}
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
