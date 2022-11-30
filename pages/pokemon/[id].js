import { useRouter } from "next/router";

import styled from "@emotion/styled";

const PageContainer = styled.div`
  margin: auto;
  width: 800px;
  padding-top: 1em;
`;

export default function SinglePokemon({ pokemon }) {
  const router = useRouter();

  return <PageContainer>{router.query.id}</PageContainer>;
}
