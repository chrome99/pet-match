import React, { useState, useContext } from "react";
import {
  UserContext,
  UserContextType,
  IUser,
  IUpdateUser,
} from "../../Contexts/UserContext";
import { Form, Row } from "react-bootstrap";
import { server } from "../../App";
import "./Profile.css";
import { object as schema } from "yup";
import { Formik } from "formik";
import { MyInput, MySubmit, MyAlert } from "../../Utils/MyForm";
import validictonary from "../../Utils/Validictonary";

function Profile() {
  const { user, changeUser } = useContext(UserContext) as UserContextType;

  const [alert, setAlert] = useState("");

  type formData = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password: string;
    confirmPassword: string;
    bio?: string;
  };
  function saveChanges(
    form: formData,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: Function
  ) {
    if (!user) return;

    const updateQuery: IUpdateUser = {
      firstName: form.firstName !== user.firstName ? form.firstName : undefined,
      lastName: form.lastName !== user.lastName ? form.lastName : undefined,
      phone: form.phone !== user.phone ? form.phone : undefined,
      email: form.email !== user.email ? form.email : undefined,
      bio: form.bio !== user.bio ? form.bio : undefined,
      password: form.password !== "" ? form.password : undefined,
    };

    //bio can be erased, so if empty string - set to null
    if (form.bio === "") {
      updateQuery.bio = null;
    }

    //if all values are undefined, alert "no changes"
    if (Object.values(updateQuery).every((val) => val === undefined)) {
      setAlert("No Changes Made");
      setSubmitting(false);
      return;
    }

    setAlert("");

    server
      .put("user/" + user.id, updateQuery, {
        headers: { "x-access-token": user.token },
      })
      .then((response) => {
        const updatedUser: IUser = {
          id: user.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone,
          email: response.data.email,
          password: response.data.password,
          bio: response.data.bio,
          admin: user.admin,
          token: user.token,
          pets: user.pets,
        };
        changeUser(updatedUser);
        resetForm();
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
    <div id="profileContainer">
      <div className="heading">Profile</div>
      <Formik
        validationSchema={schema().shape({
          firstName: validictonary.name("First Name"),
          lastName: validictonary.name("Last Name"),
          phone: validictonary.phone,
          email: validictonary.email,
          password: validictonary.password(false),
          confirmPassword: validictonary.confirmPassword(false),
          bio: validictonary.bio,
        })}
        onSubmit={(e, { setSubmitting, resetForm }) =>
          saveChanges(e, setSubmitting, resetForm)
        }
        enableReinitialize //very important so that initial values will update after request
        initialValues={{
          firstName: user?.firstName,
          lastName: user?.lastName,
          phone: user?.phone,
          email: user?.email,
          password: "",
          confirmPassword: "",
          bio: user?.bio,
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <h1>User Information</h1>
            <Row className="mb-3">
              <MyInput name="firstName" label="First Name" />
              <MyInput name="lastName" label="Last Name" />
            </Row>
            <Row>
              <MyInput name="bio" label="Bio" as="textarea" />
            </Row>

            <h1>Communication & Security</h1>
            <Row className="mb-3">
              <MyInput name="email" label="Email address" type="email" />
              <MyInput name="phone" label="Phone Number" type="tel" />
            </Row>

            <Row className="mb-3">
              <MyInput name="password" label="Password" type="password" />
              <MyInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
              />
            </Row>

            <MyAlert alert={alert} setAlert={setAlert} />
            <MySubmit text="Save Changes" isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Profile;
