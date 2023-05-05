import React from "react";
import { Modal } from "react-bootstrap";
import "./ManagePetModal.css";
import { IPet } from "../Pet/PetProfile";
import PetForm from "./PetForm";

export interface ManagePetModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  pet: IPet | null;
  setPet: React.Dispatch<React.SetStateAction<IPet | "Pet Edited" | null>>;
}
function ManagePetModal({ modal, setModal, pet, setPet }: ManagePetModalProps) {
  return (
    <Modal
      size="lg"
      show={modal}
      onHide={() => {
        setModal(false);
      }}
    >
      <Modal.Body>
        <PetForm modal={modal} setModal={setModal} pet={pet} setPet={setPet} />
      </Modal.Body>
    </Modal>
  );
}

export default ManagePetModal;
