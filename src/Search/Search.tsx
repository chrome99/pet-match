import React, { useState } from "react";
import "./Search.css";
import SearchForm from "./SearchForm";
import PetsCollection from "./PetsCollection";
import { IPet } from "./PetsCollection";

function Search() {
  const [pets, setPets] = useState<IPet[] | null>(null);

  return (
    <div id="searchPage">
      <SearchForm setPets={setPets} />
      <PetsCollection pets={pets} />
    </div>
  );
}

export default Search;
