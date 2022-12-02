import { useRouter } from "next/router";
// import { useContext } from "react";
// import PokemonContext from "../../src/PokemonContext";
import styled from "@emotion/styled";

import {
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const PageContainer = styled.div`
  margin: auto;
  width: 800px;
  padding-top: 1em;
`;

const TypeHeader = styled.span`
  font-weight: bold;
`;

// NEW
export async function getServerSideProps(context) {
  const response = await fetch("http://localhost:3000/pokemon.json");
  const allPokemon = await response.json();
  const currpokemon = allPokemon.find(
    (p) => p.id === parseInt(context.query.id)
  );
  return {
    props: {
      currpokemon,
    },
  };
}

export default function SinglePokemon({ currpokemon }) {
  // const { pokemon } = useContext(PokemonContext);
  const router = useRouter();

  // const currpokemon = pokemon?.find((p) => p.id === parseInt(router.query.id));

  return (
    <PageContainer>
      <CssBaseline />
      <div>
        {currpokemon && (
          <>
            <h1>SSR: {currpokemon.name.english}</h1>
            <p>
              <TypeHeader>Type:</TypeHeader> {" " + currpokemon.type.join(", ")}
            </p>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Attribute</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(currpokemon.base).map((key) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{currpokemon.base[key]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </PageContainer>
  );
}
