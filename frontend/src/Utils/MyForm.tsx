import React from "react";
import { Button, Form, Alert, Col, Spinner } from "react-bootstrap";
import { useField } from "formik";
import "./MyForm.css";

interface MySubmitProps {
  text: string;
  isSubmitting: boolean;
}
export function MySubmit({ text, isSubmitting }: MySubmitProps) {
  return (
    <Form.Group className="text-center" controlId="formSubmitBtn">
      <Button variant="warning" type="submit" disabled={isSubmitting}>
        <Spinner
          className={`submitSpinner ${isSubmitting ? "" : "d-none"}`}
          as="span"
          animation="border"
          size="sm"
        />
        {text}
      </Button>
    </Form.Group>
  );
}

interface MyAlertProps {
  alert: string;
  setAlert: React.Dispatch<React.SetStateAction<string>>;
}
export function MyAlert({ alert, setAlert }: MyAlertProps) {
  return (
    <Form.Group className="text-center mb-3" controlId="formAlert">
      <Alert
        variant="danger"
        dismissible={true}
        show={alert ? true : false}
        onClose={() => setAlert("")}
      >
        {alert}
      </Alert>
    </Form.Group>
  );
}

interface MyInputProps {
  label: string;
  name: string;
  type?: string;
  feedback?: string;
  as?: React.ElementType;
  xs?: any;
}
export function MyInput({
  label,
  name,
  type = "input",
  feedback,
  as,
  xs,
}: MyInputProps) {
  const [field, meta] = useField(name);

  return (
    <Col xs={xs}>
      <Form.Group controlId={`form${name}`}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          as={as}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isValid={
            meta.touched && !meta.error && field.value !== meta.initialValue
          }
          isInvalid={meta.touched && !!meta.error}
        />
        {feedback ? (
          <Form.Control.Feedback>{feedback}</Form.Control.Feedback>
        ) : (
          ""
        )}
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      </Form.Group>
    </Col>
  );
}

interface MySelectProps {
  label: string;
  name: string;
  options: string[];
  feedback?: string;
  xs?: any;
}
export function MySelect({
  label,
  name,
  options,
  xs,
  feedback,
}: MySelectProps) {
  const [field, meta] = useField(name);

  return (
    <Col xs={xs}>
      <Form.Group controlId={`form ${name}`}>
        <Form.Label>{label}</Form.Label>
        <Form.Select
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isValid={
            meta.touched && !meta.error && field.value !== meta.initialValue
          }
          isInvalid={meta.touched && !!meta.error}
        >
          {options.map((op, i) => (
            <option key={i}>{op}</option>
          ))}
        </Form.Select>
        {feedback ? (
          <Form.Control.Feedback>{feedback}</Form.Control.Feedback>
        ) : (
          ""
        )}
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      </Form.Group>
    </Col>
  );
}
