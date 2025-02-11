import React, { useState, useContext } from "react";
import { Form, Row } from "react-bootstrap";
import { server } from "../../../App";
import {
  UserContext,
  UserContextType,
  IUser,
} from "../../../Contexts/UserContext";
import { MyModalProps } from "./MyModal";
import { object as schema } from "yup";
import { Formik } from "formik";
import { MyInput, MySubmit, MyAlert } from "../../../Utils/MyForm";
import validictonary from "../../../Utils/Validictonary";

function SignupTab({ setModal }: MyModalProps) {
  const { changeUser } = useContext(UserContext) as UserContextType;

  const [alert, setAlert] = useState("");

  type formData = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  function signIn(
    form: formData,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    server
      .post("auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
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
        firstName: validictonary.name("First Name"),
        lastName: validictonary.name("Last Name"),
        phone: validictonary.phone,
        email: validictonary.email,
        password: validictonary.password(),
        confirmPassword: validictonary.confirmPassword(),
      })}
      onSubmit={(e, { setSubmitting }) => signIn(e, setSubmitting)}
      initialValues={{
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <MyInput name="firstName" label="First Name" />
            <MyInput name="lastName" label="Last Name" />
          </Row>

          <Row className="mb-3">
            <MyInput
              name="email"
              label="Email address"
              type="email"
              feedback="Now we can send you all of our beautiful ads!"
            />
            <MyInput name="phone" label="Phone Number" type="tel" />
          </Row>

          <Row className="mb-3">
            <MyInput
              name="password"
              label="Password"
              type="password"
              feedback="Looks pretty safe!"
            />
            <MyInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              feedback="Great! You just passed our memory test!"
            />
          </Row>

          <MyAlert alert={alert} setAlert={setAlert} />
          <MySubmit text="Sign In" isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}

export default SignupTab;
