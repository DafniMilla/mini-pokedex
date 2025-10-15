import { useEffect, useState } from "react";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export default function Lista() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);



async function loadPage(limit = 20, offset = 0) {
  try {
    setLoading(true);
    setError(null);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error('Erro ao buscar lista');
    const data = await res.json(); // data.results é o array de { name, url }
    setPokemonList(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
  } catch (e) {
    setError('Não foi possível carregar a lista. Tentar novamente?');
  } finally {
    setLoading(false);
  }
}
useEffect(() => {
    loadPage();
  }, []);


  const handleNavigation = (url: string | null) => {
    if (!url) return;
    const parsedUrl = new URL(url);
    const offset = Number(parsedUrl.searchParams.get("offset")) || 0;
    const limit = Number(parsedUrl.searchParams.get("limit")) || 20;
    loadPage(limit, offset);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lista de Pokémons</h1>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="list-disc pl-5">
        {pokemonList.map((pokemon) => (
          <li key={pokemon.name} className="capitalize">
            {pokemon.name}
          </li>
        ))}
      </ul>

      <div className="flex gap-4 mt-4">
        <button
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          disabled={!prevUrl || loading}
          onClick={() => handleNavigation(prevUrl)}
        >
          Anterior
        </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!nextUrl || loading}
          onClick={() => handleNavigation(nextUrl)}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}