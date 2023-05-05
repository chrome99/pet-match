import React from "react";
import "./PetsCollection.css";
import PetCard from "./PetCard";
import { IPet } from "../Pet/PetProfile";

interface PetsCollectionProps {
  pets: IPet[];
  onClickFunction?: (pet: IPet) => void;
}

function PetsCollection({ pets, onClickFunction }: PetsCollectionProps) {
  return (
    <div id="petsCollectionContainer">
      {pets.map((pet) => {
        return (
          <PetCard pet={pet} key={pet.id} onClickFunction={onClickFunction} />
        );
      })}
    </div>
  );
}

export default PetsCollection;
