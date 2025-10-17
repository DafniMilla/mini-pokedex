
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

//Define o formato esperado do Pokémon
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
  const { name } = useLocalSearchParams<{ name: string }>(); //pega o nome do pokemonda url
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null); //estado que vai armazenar os detalhes do pokemon
  const router = useRouter();

  useEffect(() => { //roda sempre que name muda
    if (name) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then((res) => res.json())
        .then(setPokemon)
        .catch((err) => console.error(err));
    }
  }, [name]);

  if (!pokemon) return <Text style={styles.loading}>Carregando...</Text>; //msg de carregamento

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/telaLista")}>
        <Ionicons name="arrow-back" size={28} color="#af0000ff" />
      </TouchableOpacity>

      <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>

      <Image
        source={{ uri: pokemon.sprites.front_default }}
        style={styles.image}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Altura: <Text style={styles.infoValue}>{pokemon.height / 10} m</Text></Text>
        <Text style={styles.infoText}>Peso: <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text></Text>
      </View>


      <Text style={styles.subtitle}>Tipos</Text>
      <View style={styles.typesContainer}>
        {pokemon.types.map((t) => (
          <View key={t.type.name} style={styles.typeBadge}>
            <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
          </View>//lista todos os tipos de pokemons
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#af0000ff",
    textAlign: "center",
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    width: "90%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoValue: {
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  typeBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#af0000ff",
    marginBottom: 5,
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: '#af0000ff"'
  },
});
