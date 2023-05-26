import React, { useState, useContext } from "react";
import { Button, Form, Alert, Row } from "react-bootstrap";
import { server } from "../../../App";
import {
  UserContext,
  UserContextType,
  IUser,
} from "../../../Contexts/UserContext";
import { MyModalProps } from "./MyModal";
import { object as schema } from "yup";
import { Formik } from "formik";
import validictonary from "../../../Utils/Validictonary";
import { MyInput, MySubmit, MyAlert } from "../../../Utils/MyForm";

function LoginTab({ setModal }: MyModalProps) {
  const { changeUser } = useContext(UserContext) as UserContextType;

  const [alert, setAlert] = useState("");

  type formData = {
    email: string;
    password: string;
  };
  function login(
    form: formData,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    server
      .post("auth/login", {
        email: form.email,
        password: form.password,
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
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <Formik
      validationSchema={schema().shape({
        email: validictonary.email,
        password: validictonary.password(),
      })}
      onSubmit={(e, { setSubmitting }) => login(e, setSubmitting)}
      initialValues={{
        email: "",
        password: "",
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <MyInput name="email" label="Email address" type="email" />
          </Row>
          <Row className="mb-3">
            <MyInput name="password" label="Password" type="password" />
          </Row>

          <MyAlert alert={alert} setAlert={setAlert} />
          <MySubmit text="Log In" isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}

export default LoginTab;
