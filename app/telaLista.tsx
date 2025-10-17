// app/pokemons/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native"; 
// define o formato esperado
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


  //roda sempre que offset muda (para paginação) Chama a função fetchPokemons.
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

  //filtra pokemons pelo nome
  useEffect(() => {
    setFilteredPokemons(
      pokemons.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, pokemons]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.home}
        onPress={() => router.push("/")}
      >
        <Ionicons name="home" size={28} color="#af0000ff" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Pesquisar Pokémon..."
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.title}>Pokémons</Text>

      <FlatList
        data={filteredPokemons}
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

      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.botaoPagina, offset === 0 && { opacity: 0.5 }]}
          onPress={() => setOffset(Math.max(0, offset - 20))}
          disabled={offset === 0}
        >
          <Text style={styles.textoBotao}>◀ Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPagina}
          onPress={() => setOffset(offset + 20)}
        >
          <Text style={styles.textoBotao}>Próxima ▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 , color:"#af0000ff"},
  input: { 
    height:80, 
    borderColor: '#000000ff', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    marginBottom: 16, 
    marginTop:23
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
  home:{},
  botaoPagina: {
    padding: 10,
    backgroundColor: "#af0000ff",
    borderRadius: 8,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  }
});
