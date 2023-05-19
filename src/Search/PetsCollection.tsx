import React, { useRef } from "react";
import "./PetsCollection.css";
import PetCard from "./PetCard";
import { IPet } from "../Pet/PetProfile";
import { Pagination } from "react-bootstrap";

interface PetsCollectionProps {
  pets: IPet[];
  onClickFunction?: (pet: IPet) => void;
  pages?: number;
  getMorePets?: (page: number) => void;
  activePage?: number;
}

function PetsCollection({
  pets,
  onClickFunction,
  pages,
  getMorePets,
  activePage,
}: PetsCollectionProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const items = [];
  if (pages) {
    for (let pageNum = 1; pageNum <= pages; pageNum++) {
      items.push(
        <Pagination.Item
          key={pageNum}
          active={pageNum === activePage}
          onClick={
            getMorePets
              ? () => {
                  getMorePets(pageNum);
                  topRef.current?.scrollIntoView({ behavior: "smooth" });
                }
              : undefined
          }
        >
          {pageNum}
        </Pagination.Item>
      );
    }
  }

  return (
    <div id="petsCollectionContainer">
      <div ref={topRef} />
      {pages ? (
        <div className="paginationContainer">
          <Pagination>{items}</Pagination>
        </div>
      ) : (
        ""
      )}
      {pets.map((pet) => {
        return (
          <PetCard pet={pet} key={pet.id} onClickFunction={onClickFunction} />
        );
      })}
      {pages ? (
        <div className="paginationContainer">
          <Pagination>{items}</Pagination>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default PetsCollection;
