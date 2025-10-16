// app/pokemons/[name].tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

interface PokemonDetail {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
}

export default function PokemonDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);


  
  useEffect(() => {
    if (name) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then((res) => res.json())
        .then(setPokemon)
        .catch((err) => console.error(err));
    }
  }, [name]);

  if (!pokemon) return <Text style={styles.loading}>Carregando...</Text>;

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>
      <Image
        source={{ uri: pokemon.sprites.front_default }}
        style={styles.image}
      />
      <Text>Altura: {pokemon.height}</Text>
      <Text>Peso: {pokemon.weight}</Text>

      <Text style={styles.subtitle}>Tipos:</Text>
      {pokemon.types.map((t) => (
        <Text key={t.type.name}>• {t.type.name}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  
  container: { alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  image: { width: 150, height: 150, marginBottom: 10 },
  subtitle: { marginTop: 10, fontWeight: "bold" },
  loading: { textAlign: "center", marginTop: 20 },
});
