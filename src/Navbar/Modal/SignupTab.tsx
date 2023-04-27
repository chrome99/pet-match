import React, { useState, useContext } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { UserContext, UserContextType, IUser } from "../../UserContext";
import { MyModalProps } from "./MyModal";

function SignupTab({ setModal }: MyModalProps) {
  const { changeUser } = useContext(UserContext) as UserContextType;

  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [verPasswordInput, setVerPasswordInput] = useState("");
  const [alert, setAlert] = useState("");

  function signIn() {
    if (passwordInput !== verPasswordInput) {
      setAlert("Passwords do not Match");
      return;
    }

    axios
      .post("http://localhost:8080/register", {
        firstName: firstNameInput,
        lastName: lastNameInput,
        phone: phoneInput,
        email: emailInput,
        password: passwordInput,
        bio: "",
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

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          value={verPasswordInput}
          onChange={(e) => setVerPasswordInput(e.target.value)}
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
  );
}

export default SignupTab;
