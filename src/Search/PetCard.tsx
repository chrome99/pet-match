import React from "react";
import "./PetCard.css";
import { IPet } from "../Pet/PetProfile";
import { Link } from "react-router-dom";

interface PetCardProps {
  pet: IPet;
}

function PetCard({ pet }: PetCardProps) {
  return (
    <Link id={pet.id} className="petCard" to={`/pet/${pet.id}`}>
      <img className="petCardImg" src={pet.picture} alt={pet.name} />
      <span>{`${pet.name} | ${pet.adoptionStatus}`}</span>
    </Link>
  );
}

export default PetCard;
