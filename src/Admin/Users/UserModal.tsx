import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./UserModal.css";
import { IUser } from "../../UserContext";
import UserProfile from "./UserProfile";

interface UserModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  setForceUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

function UserModal({
  modal,
  setModal,
  user,
  setUser,
  setForceUpdate,
}: UserModalProps) {
  return (
    <Modal
      size="lg"
      show={modal}
      onHide={() => {
        setModal(false);
      }}
    >
      <Modal.Body>
        {user ? (
          <UserProfile
            modal={modal}
            setModal={setModal}
            user={user}
            setUser={setUser}
            setForceUpdate={setForceUpdate}
          />
        ) : (
          ""
        )}
      </Modal.Body>
    </Modal>
  );
}

export default UserModal;
