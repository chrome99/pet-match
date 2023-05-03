import React, { useState } from "react";
import "./Search.css";
import SearchForm from "./SearchForm";
import PetsCollection from "./PetsCollection";
import { IPet } from "../Pet/PetProfile";

function Search() {
  const [pets, setPets] = useState<IPet[] | null>(null);

  return (
    <div id="searchPage">
      <SearchForm setPets={setPets} />
      {pets ? (
        <div id="searchResultsContainer">
          <PetsCollection pets={pets} />
        </div>
      ) : null}
    </div>
  );
}

export default Search;
