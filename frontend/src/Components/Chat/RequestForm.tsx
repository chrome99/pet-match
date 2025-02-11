import React, { useState, useContext } from "react";
import "./RequestForm.css";
import { Form, Row } from "react-bootstrap";
import { UserContext, UserContextType } from "../../Contexts/UserContext";
import { socket } from "./Socket";
import { object as schema } from "yup";
import { Formik } from "formik";
import validictonary from "../../Utils/Validictonary";
import { MyInput, MySubmit, MyAlert } from "../../Utils/MyForm";

interface RequestFormProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function RequestForm({ setModal }: RequestFormProps) {
  const { user } = useContext(UserContext) as UserContextType;
  const [alert, setAlert] = useState("");

  type formData = {
    title: string;
  };
  function submit(
    form: formData,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    if (!user) return;

    socket.emit("newRequest", {
      title: form.title,
      userId: user.id,
    });
    setModal(false);
    setSubmitting(false);
  }

  return (
    <div id="requestFormContainer">
      <Formik
        validationSchema={schema().shape({
          title: validictonary.title,
        })}
        onSubmit={(e, { setSubmitting }) => submit(e, setSubmitting)}
        initialValues={{
          title: "",
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <MyInput name="title" label="Request Title" />
            </Row>

            <MyAlert alert={alert} setAlert={setAlert} />
            <MySubmit text="Add Request" isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default RequestForm;
