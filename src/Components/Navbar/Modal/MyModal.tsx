import React, { useState } from "react";
import { Modal, Tabs, Tab } from "react-bootstrap";
import LoginTab from "./LoginTab";
import SignupTab from "./SignupTab";

export interface MyModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function MyModal({ modal, setModal }: MyModalProps) {
  const [key, setKey] = useState("login");

  return (
    <>
      <Modal
        show={modal}
        size={key === "login" ? "sm" : undefined}
        onHide={() => {
          setModal(false);
        }}
        onExited={() => setKey("login")}
      >
        <Modal.Body>
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k as string)}
            id="tabs"
            className="mb-3"
            justify
          >
            <Tab eventKey="login" title="Log In">
              <LoginTab modal={modal} setModal={setModal} />
            </Tab>
            <Tab eventKey="signup" title="Sign Up">
              <SignupTab modal={modal} setModal={setModal} />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MyModal;
