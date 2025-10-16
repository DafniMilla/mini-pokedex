// app/pokemons/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";

// Interface do Pokémon
interface Pokemon {
  name: string;
  url: string;
}

export default function PokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState('');

  const router = useRouter();

  // Carregar pokémons da API
  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
      const data = await response.json();
      setPokemons(data.results);
    } catch (error) {
      console.error("Erro ao carregar pokémons:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pokémons pelo nome
  useEffect(() => {
    setFilteredPokemons(
      pokemons.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, pokemons]);

  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar Pokémon..."
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.title}>Pokémons</Text>

      {/* Lista de Pokémon */}
      <FlatList
        data={filteredPokemons} // <-- Usar lista filtrada
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push({ pathname: "/detalhes/[id]", params: { name: item.name } })}
          >
            <Text style={styles.name}>{item.name.toUpperCase()}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Paginação */}
      <View style={styles.pagination}>
        <Button
          title="Anterior"
          onPress={() => setOffset(Math.max(0, offset - 20))}
          disabled={offset === 0}
        />
        <Button title="Próxima" onPress={() => setOffset(offset + 20)} />
      </View>

      {/* Loading */}
      {loading && <Text style={styles.loading}>Carregando...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { 
    height: 40, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    marginBottom: 16 
  },
  item: {
    padding: 15,
    backgroundColor: "#f1f1f1",
    marginBottom: 8,
    borderRadius: 10,
  },
  name: { fontSize: 16, textTransform: "capitalize" },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  loading: { textAlign: "center", marginTop: 10 },
});
