import React, { useEffect, useContext, useState, useRef } from "react";
import "./Chat.css";
import { useParams } from "react-router";
import { socket } from "./Socket";
import { UserContext, UserContextType } from "../UserContext";
import { Form, Button, InputGroup } from "react-bootstrap";
import uniqid from "uniqid";
import axios from "axios";

type Message = {
  _id: string;
  room: string;
  userId: string;
  userName: string;
  createdAt: Date;
  value: string;
};

function Chat() {
  const { adminRoomId } = useParams();
  const { user } = useContext(UserContext) as UserContextType;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [msgInput, setMsgInput] = useState("asd");
  const allMessagesRef = useRef<null | HTMLDivElement>(null);
  const roomId = adminRoomId ? adminRoomId : user?.id;

  useEffect(() => {
    if (!user) return;

    function fetchData() {
      if (!user) return;

      axios
        .get("http://localhost:8080/messages/" + roomId, {
          headers: { "x-access-token": user.token },
        }) //room
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNewMsg(message: any) {
      console.log(message);
      setMessages((messages) => [...messages, message]);
    }

    fetchData();

    socket.connect();

    socket.emit("joinRoom", roomId);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("sendMessage", onNewMsg);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("sendMessage", onNewMsg);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    allMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMsg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const newMsg: Message = {
      _id: uniqid(),
      room: roomId as string,
      userId: user.id,
      userName: user.firstName + " " + user.lastName,
      createdAt: new Date(),
      value: msgInput,
    };
    socket.emit("sendMessage", newMsg);
    setMsgInput("");
  }

  return (
    <div id="chatContainer">
      <h1>Chat</h1>
      <div id="allMessages">
        {messages.map((message) => {
          return (
            <p key={message._id}>
              {<b>{message.userName} :</b>} {message.value}
            </p>
          );
        })}
        <div ref={allMessagesRef} />
      </div>
      <Form onSubmit={sendMsg}>
        <InputGroup>
          <Form.Control
            type="input"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default Chat;
