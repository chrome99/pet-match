import React, { useState, useContext } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import "./Home.css";
import { UserContext, UserContextType, IUser } from "../UserContext";

interface SignInModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function SignInModal({ modal, setModal }: SignInModalProps) {
  const { changeUser } = useContext(UserContext) as UserContextType;

  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [alert, setAlert] = useState("");

  function signIn() {
    axios
      .post("http://localhost:8080/register", {
        firstName: firstNameInput,
        lastName: lastNameInput,
        phone: phoneInput,
        email: emailInput,
        password: passwordInput,
      })
      .then((response) => {
        const newUser: IUser = {
          id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone,
          email: response.data.email,
          password: response.data.password,
          admin: response.data.admin,
        };
        changeUser(newUser);
        closeModal();
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
      });
  }

  function resetValues() {
    setFirstNameInput("");
    setLastNameInput("");
    setEmailInput("");
    setPhoneInput("");
    setPasswordInput("");
    setAlert("");
  }

  function closeModal() {
    resetValues();
    setModal(false);
  }

  return (
    <Modal show={modal} onHide={() => closeModal()}>
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formFName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="input"
              value={firstNameInput}
              onChange={(e) => setFirstNameInput(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="input"
              value={lastNameInput}
              onChange={(e) => setLastNameInput(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </Form.Group>

          <Form.Group className={`text-center`} controlId="formAlert">
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
              variant="primary"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              Sign In
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default SignInModal;
