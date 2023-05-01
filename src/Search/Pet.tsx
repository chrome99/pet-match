import React from "react";
import "./Pet.css";
import { IPet } from "./PetsCollection";

interface PetProps {
  pet: IPet;
}

function Pet({ pet }: PetProps) {
  return (
    <div id={pet.id} className="pet">
      <img className="petImg" src={pet.picture} alt={pet.name} />
      <span>{`${pet.name} | ${pet.adoptionStatus}`}</span>
    </div>
  );
}

export default Pet;
