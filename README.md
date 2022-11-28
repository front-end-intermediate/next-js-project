# NextJS

<!-- https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/ -->

`npx create-next-app@latest next-project`

<!-- `npx create-next-app --example with-mongodb next-project` -->

<!-- Rename the env fille to `.env.local` and add: -->

<!-- `MONGODB_URI=mongodb://localhost:27017` -->

<!-- Note: environment variables are read only on start up. When changing env files restart the app if running. -->

Note: running `start` in a NextJS app runs from the production build folder. Use:

`npm run dev`

Things to note:

1. CSS modules
2. Pages folder
3. `_app` file

## PokeAPI

`https://pokemondb.net/pokedex/national`

Add images, `pokemon.json` and `logo.svg` to the public folder.

## Document

There is no HTML document in our NextJS project. We cannot add a favicon.

Add `_document.js`:

```js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="logo.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

## Load and Display Pokemon

In a new `pages/pokemon.js` file:

```js
import React from "react";

const PokemonRow = ({ pokemon }) => (
  <tr key={pokemon.id}>
    <td>{pokemon.name.english}</td>
    <td>{pokemon.type.join(", ")}</td>
  </tr>
);

export default function Pokemon() {
  const [pokemon, pokemonSet] = React.useState(null);

  React.useEffect(() => {
    fetch("/pokemon.json")
      .then((resp) => resp.json())
      .then((data) => pokemonSet(data));
  }, []);

  if (!pokemon) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <h1>Pokemon Search</h1>
      <div>
        <table width="100%">
          <tbody>
            {pokemon.map((pokemon) => (
              <PokemonRow key={pokemon.id} pokemon={pokemon} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## Display Pokemon Details

Still working in `pages/pokemon.js`, add a new PokemonInfo component and a button to the Rows.

```js
const PokemonRow = ({ pokemon, onClick }) => (
  <tr key={pokemon.id}>
    <td>{pokemon.name.english}</td>
    <td>{pokemon.type.join(", ")}</td>
    {/* NEW table cell */}
    <td>
      <button onClick={() => onClick(pokemon)}>More Information</button>
    </td>
  </tr>
);

// NEW component
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
```

Add `selectedPokemon` state to the Pokemon component and compose the new `PokemonInfo` component.

```js
export default function Pokemon() {
  const [pokemon, pokemonSet] = React.useState(null);
  // NEW
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
    <div>
      <h1>Pokemon Search</h1>
      <div>
        <div>
          <table width="100%">
            <tbody>
              {pokemon.map((pokemon) => (
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
      </div>
    </div>
  );
}
```

Test the button.

That's a lot of pokemon. We will restrict the number and allow the user to filter them.

## Filter Pokemon

We will add a new `filter` state, an input field, and then use the filtered data as the source of displayed pokemon.

```js
export default function Pokemon() {
  // NEW
  const [filter, filterSet] = React.useState("");
  const [pokemon, pokemonSet] = React.useState(null);
  const [selectedPokemon, selectedPokemonSet] = React.useState(null);

  React.useEffect(() => {
    fetch("/pokemon.json")
      .then((resp) => resp.json())
      .then((data) => pokemonSet(data));
  }, []);

  if (!pokemon) {
    return <div>Loading data</div>;
  }

  return (
    <div>
      <h1>Pokemon Search</h1>
      <div>
        <div>
          <input
            type="text"
            value={filter}
            onChange={(event) => filterSet(event.target.value)}
          />
          <table width="100%">
            <tbody>
              {pokemon
                .filter(({ name: { english } }) =>
                  english
                    .toLocaleLowerCase()
                    .includes(filter.toLocaleLowerCase())
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
      </div>
    </div>
  );
}
```

Note the use of [toLocaleLowerCase](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase) to convert the English name to lower case.

## Material UI

We will use [Material UI](https://mui.com) as a source of ready made components.

`npm install @mui/material @emotion/react @emotion/styled`

Try using an [MUI Button](https://mui.com/material-ui/react-button/) component in `PokemonRow`:

```js
import React from "react";
// NEW
import { Button } from "@mui/material";

const PokemonRow = ({ pokemon, onClick }) => (
  <>
    <tr key={pokemon.id}>
      <td>{pokemon.name.english}</td>
      <td>{pokemon.type.join(", ")}</td>
      <td>
        {/* NEW */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => onClick(pokemon)}
        >
          More Information
        </Button>
      </td>
    </tr>
  </>
);
```

Use an MUI [Text Field](https://mui.com/material-ui/react-text-field/).

```js
import { Button, TextField } from "@mui/material";
...
 <TextField
   variant="standard"
   type="search"
   label="Filter Pokemon"
   value={filter}
   onChange={(event) => filterSet(event.target.value)}
 />
```

## Styled Components

MUI uses [Emotion](https://emotion.sh/docs/introduction) internally. Emotion is similar to Styled Components and can be used without MUI.

MUI offers page layout tools but we will use Emotion instead.

```js
import React from "react";
import styled from "@emotion/styled";
import { Button } from "@mui/material";

// ...

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
const Input = styled.input`
  width: 100%;
  padding: 0.2rem;
  font-size: large;
  margin: 2rem 0;
`;

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
    return <div>Loading data</div>;
  }

  return (
    <PageContainer>
      <Title>Pokemon Search</Title>
      <TwoColumnLayout>
        <div>
          <TextField
            variant="standard"
            type="search"
            value={filter}
            label="Filter Pokemon"
            onChange={(event) => filterSet(event.target.value)}
          />
          <table width="100%">
            <tbody>
              {pokemon
                .filter(({ name: { english } }) =>
                  english
                    .toLocaleLowerCase()
                    .includes(filter.toLocaleLowerCase())
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
  );
}
```

## Navigation

Create a Nav component `components/nav.js`:

```js
import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/pokemon">Pokemon</Link>
      </li>
      <li>
        <Link href="/movies">Movies</Link>
      </li>
    </nav>
  );
}
```

Import and compose it in `pokemon.js`.

Update it to use MUI following [this formula](https://mui.com/material-ui/react-app-bar/):

```js
import Link from "next/link";
import styled from "@emotion/styled";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem;
`;

export default function Nav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <StyledLink href="/">Home</StyledLink>
            <StyledLink href="/pokemon">Pokemon</StyledLink>
            <StyledLink href="/movies">Movies</StyledLink>
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
```

Note: we'll need it install `@mui/icons-material`.

Import it and compose it in all pages. e.g.:

```js
  return (
    <>
      <Nav />
      <PageContainer>
```

## NextJS Dynamic Routes

[NextJS Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes) are routing utilities for creating pages that use parameters.

Create `components/PokemonRow.js`

```js
import { Button } from "@mui/material";

export const PokemonRow = ({ pokemon, onClick }) => (
  <tr key={pokemon.id}>
    <td>{pokemon.name.english}</td>
    <td>{pokemon.type.join(", ")}</td>
    {/* NEW table cell */}
    <td>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => onClick(pokemon)}
      >
        More Information
      </Button>
    </td>
  </tr>
);
```

And import it into pokemon:

```js
import { PokemonRow } from "../components/PokemonRow";
```

Create a Link in `PokemonRow`:

```js
import { Button } from "@mui/material";
import Link from "next/link";

export const PokemonRow = ({ pokemon, onClick }) => (
  <>
    <tr key={pokemon.id}>
      <td>
        <Link href={`/pokemon/${pokemon.id}`}>{pokemon.name.english}</Link>
      </td>
      <td>{pokemon.type.join(", ")}</td>
      <td>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onClick(pokemon)}
        >
          More Information
        </Button>
      </td>
    </tr>
  </>
);
```

Create `pages/pokemon/[id].js`:

```js
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
```

ALT

```js
import { useRouter } from "next/router";

import styled from "@emotion/styled";

const PageContainer = styled.div`
  margin: auto;
  width: 800px;
  padding-top: 1em;
`;

export default function Post({ pokemon }) {
  const router = useRouter();

  return <PageContainer>{router.query.id}</PageContainer>;
}
```

When the app sees a url such as `/pokemon/2` it will map the number to query parameter called id and invoke this page.

We need to make the pokemon collection available to this component in order to filter on them and display the info for a single Pokemon.

## Context

We will use [React Context](https://reactjs.org/docs/context.html) to make the pokemon collection available to any component in our app without prop drilling.

Create `src/PokemonContext.jsx`:

```js
import React from "react";

const PokemonContext = React.createContext({});

export default PokemonContext;
```

Import it into the pokemon page:

```js
import PokemonContext from "../src/PokemonContext";
```

and enclose entire component with the Context.Provider method:

```js
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
      <CssBaseline />
      <Title>Pokemon Search</Title>
      <TwoColumnLayout>...</TwoColumnLayout>
    </PageContainer>
  </PokemonContext.Provider>
);
```

Let's test it.

Create `components/PokemonFilter.jsx`:

```js
import React, { useContext } from "react";
import { TextField } from "@mui/material";

import PokemonContext from "../src/PokemonContext";

export const PokemonFilter = () => {
  const { filter, filterSet } = useContext(PokemonContext);

  return (
    <TextField
      variant="standard"
      type="search"
      value={filter}
      label="Filter Pokemon"
      onChange={(event) => filterSet(event.target.value)}
    />
  );
};
```

And compose it:

```js
import { PokemonFilter } from "../components/PokemonFilter";
```

```js
<div>
  <PokemonFilter />
  <table width="100%">
    <tbody>
      {pokemon
        .filter(({ name: { english } }) =>
          english.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
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
```

Note: the necessary filter and filterSet props are available in the filter component via Context, not props:

This works for PokemonFilter but not for `[id].js` because it is a page, not a child of `pokemon.js`. We need to set the Context higher up in the app to make the data available to all pages.

Since NextJS follows a different paradigm and structures the application into individual pages, there is no `index.js` like what we saw in the Create React App. It has been abstracted away.

The work around for this is to create a [custom app](https://nextjs.org/docs/advanced-features/custom-app): `pages/_app.jsx`

```js
import React from "react";
import PokemonContext from "../src/PokemonContext";

export default function MyApp({ Component, pageProps }) {
  const [pokemon, pokemonSet] = React.useState([]);
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
      }}
    >
      <Component {...pageProps} />
    </PokemonContext.Provider>
  );
}
```

Once we have done this we need to change the pokemon page.

1. import useContext
2. Take the initial pokemon from PokemonContext
3. Remove the useEffect call

```js
import React, { useContext } from "react";

// get the pokemon from context
// const [pokemon, pokemonSet] = React.useState(null);
const { pokemon, pokemonSet } = useContext(PokemonContext);
...
// React.useEffect(() => {
//   fetch("/pokemon.json")
//     .then((resp) => resp.json())
//     .then((data) => pokemonSet(data));
// }, []);
...
// <PokemonContext.Provider
//   value={{
//     filter,
//     pokemon,
//     filterSet,
//     pokemonSet,
//     selectedPokemon,
//     selectedPokemonSet,
//   }}
// >
```

Ensure we can see the pokemon collection in `[id].js`:

```js
import { useContext } from "react";
import { useRouter } from "next/router";
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

  return (
    <PageContainer>
      {JSON.stringify(pokemon[router.query.id], null, 2)}
    </PageContainer>
  );
}
```

Let's filter for the pokemon with the id and view it:

```js
export default () => {
  const { pokemon } = useContext(PokemonContext);
  const router = useRouter();
  const currpokemon = pokemon.find((p) => p.id === parseInt(router.query.id));

  return (
    <PageContainer>
      {router.query.id}, {JSON.stringify(currpokemon, null, 2)}
    </PageContainer>
  );
};
```

Use MUI to style the content.

```js
import { useContext } from "react";
import { useRouter } from "next/router";
import PokemonContext from "../../src/PokemonContext";
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

export default function SinglePokemon() {
  const { pokemon } = useContext(PokemonContext);
  const router = useRouter();
  const currpokemon = pokemon.find((p) => p.id === parseInt(router.query.id));

  return (
    <PageContainer>
      <CssBaseline />
      <div>
        {currpokemon && (
          <>
            <h1>{currpokemon.name.english}</h1>
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
            <pre>
              <code>{JSON.stringify(currpokemon, null, 2)}</code>
            </pre>
          </>
        )}
      </div>
    </PageContainer>
  );
}
```

Test the filter. It needs access to filter and filterSet. We'll add it to `_app.js` along with Material UI's ThemeProvider context provider and the CssBaseLine MUI component.

In `_app.js`:

```js
import React from "react";
import PokemonContext from "../src/PokemonContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function MyApp({ Component, pageProps }) {
  const [pokemon, pokemonSet] = React.useState([]);
  const [filter, filterSet] = React.useState("");
  React.useEffect(() => {
    fetch("/pokemon.json")
      .then((resp) => resp.json())
      .then((data) => pokemonSet(data));
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <PokemonContext.Provider
        value={{
          pokemon,
          pokemonSet,
          filter,
          filterSet,
        }}
      >
        <CssBaseline />
        <Component {...pageProps} />
      </PokemonContext.Provider>
    </ThemeProvider>
  );
}
```

## Server Side Rendering

Save `pokemon.js` as `server-side-pokemon.js` into the pages folder`.

In a SPA the page is rendered on the client (browser). In SSR the page is generated on the server when the server gets a request. This allows for superior search engine optimization.

To use SSR for a page, we need to export an async [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) function. This async function is called each time a request is made for the page.

Add to `server-side-pokemon.js`:

```js
export async function getServerSideProps() {
  const response = await fetch("http://localhost:3000/pokemon.json");
  const pokemon = await response.json();
  return {
    props: {
      pokemon,
    },
  };
}
```

Any exported `getServerSideProps` function is called on the server before the page is rendered and the server will create properties that are then sent to the page component.

We no longer need pokemon from Context. Remove Context, the provider, and pass the pokemon into the component:

```js
import React from "react";
// import PokemonContext from "../src/PokemonContext";
import styled from "@emotion/styled";
import { CssBaseline } from "@mui/material";
import { PokemonRow } from "../components/PokemonRow";
import { PokemonInfo } from "../components/PokemonInfo";
import { PokemonFilter } from "../components/PokemonFilter";

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
const Input = styled.input`
  width: 100%;
  padding: 0.2rem;
  font-size: large;
`;

export async function getServerSideProps() {
  const response = await fetch("http://localhost:3000/pokemon.json");
  const pokemon = await response.json();
  // send the list of pokemon to the component
  return {
    props: {
      pokemon,
    },
  };
}

// NEW
export default function Pokemon({ pokemon }) {
  const [filter, filterSet] = React.useState("");
  // const { pokemon, pokemonSet } = useContext(PokemonContext);
  const [selectedPokemon, selectedPokemonSet] = React.useState(null);

  if (!pokemon) {
    return <div>Loading data</div>;
  }

  return (
    // <PokemonContext.Provider
    //   value={{
    //     filter,
    //     pokemon,
    //     filterSet,
    //     pokemonSet,
    //     selectedPokemon,
    //     selectedPokemonSet,
    //   }}
    // >
    <PageContainer>
      <Title>Pokemon Search</Title>
      <TwoColumnLayout>
        <div>
          <PokemonFilter filter={filter} filterSet={filterSet} />
          <table width="100%">
            <tbody>
              {pokemon
                .filter(({ name: { english } }) =>
                  english
                    .toLocaleLowerCase()
                    .includes(filter.toLocaleLowerCase())
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
    // </PokemonContext.Provider>
  );
}
```

View page source. All the the data is in a script tag.

Here, we are only generating the HTML on the server only once for the requested page so that search engines see the proper HTML while the application will behave exactly the same in the browser.

React needs the data in order to create a new tree that matches the tree on the page.

Since the server will return the proper HTML for the page, the user will no longer see a blank screen until all application resources are downloaded.

We can perform SSR on the individual views as well.

Create a new `pages/ssr/` directory and save `[id].js` into it.

Create an alternate link that uses this path in `PokemonRow.js`:

```js
<td>
  <Link href={`/pokemon/${pokemon.id}`}>{pokemon.name.english}</Link>
  <br />
  <Link href={`/ssr/${pokemon.id}`}>SSR {pokemon.name.english}</Link>
</td>
```

In `ssr/[id].js`:

```js
// import { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// import PokemonContext from "../../src/PokemonContext";
import {
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import styled from "@emotion/styled";

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

export default ({ currpokemon }) => {
  const router = useRouter();
  // const { pokemon } = useContext(PokemonContext);
  // const currpokemon = pokemon.find((p) => p.id === parseInt(router.query.id));
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
            <Link href={`/`}>Home</Link>
            <pre>
              <code>{JSON.stringify(currpokemon, null, 2)}</code>
            </pre>
          </>
        )}
      </div>
    </PageContainer>
  );
};
```

At this point we can comment out the fetch in `_app.js`. Note the network tab. There is no fetch. The data is called on the server, not the front end.

## Static Site Generation

For SSG NextJS uses [getStaticPaths](https://nextjs.org/docs/basic-features/data-fetching/get-static-paths).

Ensure `pokemon.json` is in the `src` directory.

In `[id].jsx`:

```js
export const getStaticPaths = async () => {
  const pokemon = require("../../src/pokemon.json");
  const paths = pokemon.map((p) => ({
    params: {
      id: p.id.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const allPokemon = require("../../src/pokemon.json");
  const currpokemon = allPokemon.find(
    (p) => p.id === parseInt(context.params.id)
  );
  return {
    props: { currpokemon },
  };
};
```

---

Note: at this point the filter is broken.

```js
import React, { useContext } from "react";
import styled from "@emotion/styled";

// import PokemonContext from "../src/PokemonContext";

const Input = styled.input`
  width: 100%;
  padding: 0.2rem;
  font-size: large;
`;

export const PokemonFilter = ({ filter, filterSet }) => {
  // const { filter, filterSet } = useContext(PokemonContext);

  return (
    <Input
      type="text"
      value={filter}
      onChange={(event) => filterSet(event.target.value)}
    />
  );
};
```

And in pokemon.sj:

```js
<PokemonFilter filter={filter} filterSet={filterSet} />
```

---

In order to run SSG for the home page we need to make a few changes to `pokemon.js`:

```js
import React, { useState } from "react";
// import PokemonContext from "../src/PokemonContext";
import styled from "@emotion/styled";
import { CssBaseline } from "@mui/material";

import allpokemon from "../public/pokemon.json";

import { PokemonRow } from "../components/PokemonRow";
import { PokemonFilter } from "../components/PokemonFilter";

// const PokemonInfo = ({ name: { english }, base }) => (
//   <div>
//     <h2>{english}</h2>
//     <table>
//       <tbody>
//         {Object.keys(base).map((key) => (
//           <tr key={key}>
//             map
//             <td>{key}</td>
//             <td>{base[key]}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

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

export default function Pokemon() {
  const [filter, filterSet] = React.useState("");
  // const { pokemon, pokemonSet } = useContext(PokemonContext);
  const [pokemon, pokemonSet] = useState(allpokemon);
  const [selectedPokemon, selectedPokemonSet] = React.useState(null);

  if (!pokemon) {
    return <div>Loading data</div>;
  }

  return (
    // <PokemonContext.Provider
    //   value={{
    //     filter,
    //     pokemon,
    //     filterSet,
    //     pokemonSet,
    //     selectedPokemon,
    //     selectedPokemonSet,
    //   }}
    // >
    <PageContainer>
      <CssBaseline />
      <Title>Pokemon Search</Title>
      <TwoColumnLayout>
        <div>
          <PokemonFilter />
          <table width="100%">
            <tbody>
              {pokemon
                .filter(({ name: { english } }) =>
                  english
                    .toLocaleLowerCase()
                    .includes(filter.toLocaleLowerCase())
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
    // </PokemonContext.Provider>
  );
}
```

To see the individual pages for all the pokemon run a build.

Create an export script in package.json:

```js
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next export",
    "start": "next start"
  },
```

`npm run build`
`npm run export`

cd into the new `out` directory and run:

`PORT=6789 npx serve`
