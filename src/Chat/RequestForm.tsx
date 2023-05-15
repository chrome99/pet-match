import React, { useState, useContext } from "react";
import "./RequestForm.css";
import { Form, Button, Alert } from "react-bootstrap";
import { UserContext, UserContextType } from "../UserContext";
import { socket } from "./Socket";

interface RequestFormProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function RequestForm({ setModal }: RequestFormProps) {
  const { user } = useContext(UserContext) as UserContextType;
  const [alert, setAlert] = useState("");

  const [titleInput, setTitleInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");

  function submit() {
    if (!user) return;

    if (titleInput.length > 65) {
      setAlert("Title is too long");
      return;
    }

    socket.emit("newRequest", {
      title: titleInput,
      body: bodyInput,
      userId: user.id,
      userName: user.firstName + " " + user.lastName,
    });
    setModal(false);

    /*
    axios
      .post(
        "http://localhost:8080/request",
        {
          title: titleInput,
          body: bodyInput,
          userId: user.id,
          userName: user.firstName + " " + user.lastName,
        },
        {
          headers: {
            "x-access-token": user.token,
          },
        }
      )
      .then((response) => {
        response.data.id = response.data._id;
        addRequest(response.data);
        setModal(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        setAlert(error.response.data);
      });
      */
  }

  return (
    <div id="requestFormContainer">
      <Form>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Request Title</Form.Label>
          <Form.Control
            type="input"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formRequest">
          <Form.Label>Your Request</Form.Label>
          <Form.Control
            type="textarea"
            value={bodyInput}
            onChange={(e) => setBodyInput(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3 text-center" controlId="formAlert">
          <Alert
            variant="danger"
            dismissible={true}
            show={alert ? true : false}
            onClose={() => setAlert("")}
          >
            {alert}
          </Alert>
        </Form.Group>
        <Form.Group className="text-center" controlId="formBtn">
          <Button
            variant="warning"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            Add Request
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default RequestForm;
