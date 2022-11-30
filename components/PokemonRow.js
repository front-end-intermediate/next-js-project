import { Button } from "@mui/material";
import Link from "next/link";

export const PokemonRow = ({ pokemon, onClick }) => (
  <tr key={pokemon.id}>
    <td>
      <Link href={`/pokemon/${pokemon.id}`}>{pokemon.name.english}</Link>
    </td>
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
