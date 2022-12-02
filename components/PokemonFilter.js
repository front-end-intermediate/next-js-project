import React, { useContext } from "react";
import { TextField } from "@mui/material";
import styled from "@emotion/styled";
// import PokemonContext from "../src/PokemonContext";

const StyledTextField = styled(TextField)`
  width: 100%;
  padding: 0.2rem;
  font-size: large;
  margin: 2rem 0;
`;

export const PokemonFilter = ({ filter, filterSet }) => {
  // const { filter, filterSet } = useContext(PokemonContext);

  return (
    <StyledTextField
      variant="standard"
      type="search"
      value={filter}
      label="Filter Pokemon"
      onChange={(event) => filterSet(event.target.value)}
    />
  );
};
