import React from "react";
import { Modal } from "react-bootstrap";
import "./ManagePetModal.css";
import { IPet } from "../../Pet/PetProfile";
import PetForm from "./PetForm";

export interface ManagePetModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  pet: IPet | null;
  updatePet: (petToUpdate: IPet) => void;
  addPet: (newPet: IPet) => void;
}
function ManagePetModal({
  modal,
  setModal,
  pet,
  updatePet,
  addPet,
}: ManagePetModalProps) {
  return (
    <Modal
      size="lg"
      show={modal}
      onHide={() => {
        setModal(false);
      }}
    >
      <Modal.Body>
        <PetForm
          modal={modal}
          setModal={setModal}
          pet={pet}
          updatePet={updatePet}
          addPet={addPet}
        />
      </Modal.Body>
    </Modal>
  );
}

export default ManagePetModal;
