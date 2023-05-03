import React from "react";
import "./PetsCollection.css";
import PetCard from "./PetCard";
import { IPet } from "../Pet/PetProfile";

interface PetsCollectionProps {
  pets: IPet[];
}

function PetsCollection({ pets }: PetsCollectionProps) {
  return (
    <div id="petsCollectionContainer">
      {pets.map((pet) => {
        return <PetCard pet={pet} key={pet.id} />;
      })}
    </div>
  );
}

export default PetsCollection;
