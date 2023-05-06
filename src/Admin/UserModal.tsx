import React from "react";
import { Modal } from "react-bootstrap";
import "./UserModal.css";
import { IUser } from "../UserContext";
import UserProfile from "./UserProfile";

interface UserModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

function UserModal({ modal, setModal, user, setUser }: UserModalProps) {
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
          />
        ) : (
          ""
        )}
      </Modal.Body>
    </Modal>
  );
}

export default UserModal;
