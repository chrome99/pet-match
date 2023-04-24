import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "./Home.css";

interface SignInModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function SignInModal({ modal, setModal }: SignInModalProps) {
  return (
    <Modal show={modal} onHide={() => setModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formFName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="input" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="input" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="tel" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" />
          </Form.Group>

          <Form.Group className="text-center" controlId="formBtn">
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setModal(false);
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
