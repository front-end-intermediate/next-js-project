import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import PokemonContext from "../src/PokemonContext";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [pokemon, pokemonSet] = React.useState(null);
  const [filter, filterSet] = React.useState("");

  React.useEffect(() => {
    fetch("/pokemon.json")
      .then((resp) => resp.json())
      .then((data) => pokemonSet(data));
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        pokemon,
        pokemonSet,
        filter,
        filterSet,
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </PokemonContext.Provider>
  );
}
