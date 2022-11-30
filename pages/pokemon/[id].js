import { useRouter } from "next/router";
import { useContext } from "react";
import PokemonContext from "../../src/PokemonContext";
import styled from "@emotion/styled";

const PageContainer = styled.div`
  margin: auto;
  width: 800px;
  padding-top: 1em;
`;

export default function SinglePokemon() {
  const { pokemon } = useContext(PokemonContext);
  const router = useRouter();

  const currpokemon = pokemon?.find((p) => p.id === parseInt(router.query.id));

  return (
    <PageContainer>
      {router.query.id}, {JSON.stringify(currpokemon, null, 2)}
    </PageContainer>
  );
}
