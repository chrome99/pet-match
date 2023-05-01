import React from "react";
import "./PetsCollection.css";
import Pet from "./Pet";

export type IPet = {
  id: string;
  type: string;
  name: string;
  adoptionStatus: "Fostered" | "Adopted" | "Available";
  picture: string;
  height: number;
  weight: number;
  color: string;
  bio: string;
  hypoallergnic: boolean;
  dietery: string[];
  breed: string;
};

interface PetsCollectionProps {
  pets: IPet[] | null;
}

function PetsCollection({ pets }: PetsCollectionProps) {
  return (
    <div id="petsCollectionContainer">
      {pets
        ? pets.map((pet) => {
            return <Pet pet={pet} key={pet.id} />;
          })
        : null}
    </div>
  );
}

export default PetsCollection;
