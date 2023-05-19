import React from "react";
import { Modal } from "react-bootstrap";
import "./UserModal.css";
import { IUser } from "../../UserContext";
import UserProfile from "./UserProfile";

interface UserModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser | null;
  updateUserAdmin: (userToUpdate: IUser) => void;
}

function UserModal({ modal, setModal, user, updateUserAdmin }: UserModalProps) {
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
          <UserProfile user={user} updateUserAdmin={updateUserAdmin} />
        ) : (
          ""
        )}
      </Modal.Body>
    </Modal>
  );
}

export default UserModal;
