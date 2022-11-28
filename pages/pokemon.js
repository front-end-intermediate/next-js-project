import React from "react";

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

export default function Pokemon() {
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
