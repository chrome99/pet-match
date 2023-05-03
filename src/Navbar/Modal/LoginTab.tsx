import React, { useState, useContext } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { UserContext, UserContextType, IUser } from "../../UserContext";
import { MyModalProps } from "./MyModal";

function LoginTab({ setModal }: MyModalProps) {
  const { changeUser } = useContext(UserContext) as UserContextType;

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [alert, setAlert] = useState("");

  function login() {
    axios
      .post("http://localhost:8080/login", {
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
          bio: response.data.bio,
          admin: response.data.admin,
          token: response.data.token,
          pets: response.data.pets,
        };
        changeUser(newUser);
        setModal(false);
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
      });
  }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
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
            login();
          }}
        >
          Log In
        </Button>
      </Form.Group>
    </Form>
  );
}

export default LoginTab;
