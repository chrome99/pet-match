import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "./Home.css";

interface LogInModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function LogInModal({ modal, setModal }: LogInModalProps) {
  return (
    <Modal show={modal} onHide={() => setModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" />
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

export default LogInModal;
