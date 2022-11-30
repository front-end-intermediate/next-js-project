import React from "react";
// import { TextField } from "@mui/material";
import styled from "@emotion/styled";
import { PokemonRow } from "../components/PokemonRow";
import PokemonContext from "../src/PokemonContext";
import { PokemonFilter } from "../components/PokemonFilter";

const PokemonInfo = ({ name: { english }, base }) => (
  <div>
    <h2>{english}</h2>
    <table>
      <tbody>
        {Object.keys(base).map((key) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{base[key]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Title = styled.h1`
  text-align: center;
`;
const PageContainer = styled.div`
  margin: auto;
  width: 800px;
  padding-top: 1em;
`;
const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  grid-column-gap: 1rem;
`;
// const StyledTextField = styled(TextField)`
//   width: 100%;
//   padding: 0.2rem;
//   font-size: large;
//   margin: 2rem 0;
// `;

export default function Pokemon() {
  const [filter, filterSet] = React.useState("");
  const [pokemon, pokemonSet] = React.useState(null);
  const [selectedPokemon, selectedPokemonSet] = React.useState(null);

  React.useEffect(() => {
    fetch("/pokemon.json")
      .then((resp) => resp.json())
      .then((data) => pokemonSet(data));
  }, []);

  if (!pokemon) {
    return <div>Loading data...</div>;
  }

  return (
    <PokemonContext.Provider
      value={{
        filter,
        pokemon,
        filterSet,
        pokemonSet,
        selectedPokemon,
        selectedPokemonSet,
      }}
    >
      <PageContainer>
        <Title>Pokemon Search</Title>
        <TwoColumnLayout>
          <div>
            {/* <StyledTextField
              variant="outlined"
              type="text"
              value={filter}
              label="filter string"
              fullWidth
              onChange={(event) => filterSet(event.target.value)}
            /> */}
            <PokemonFilter />

            <table width="100%">
              <tbody>
                {pokemon
                  .filter((pokemon) =>
                    pokemon.name.english
                      .toLowerCase()
                      .includes(filter.toLowerCase())
                  )
                  .slice(0, 20)
                  .map((pokemon) => (
                    <PokemonRow
                      key={pokemon.id}
                      pokemon={pokemon}
                      onClick={(pokemon) => selectedPokemonSet(pokemon)}
                    />
                  ))}
              </tbody>
            </table>
          </div>
          {selectedPokemon && <PokemonInfo {...selectedPokemon} />}
        </TwoColumnLayout>
      </PageContainer>
    </PokemonContext.Provider>
  );
}
