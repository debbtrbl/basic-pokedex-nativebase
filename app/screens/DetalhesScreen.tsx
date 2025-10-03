import { useState, useEffect } from "react";
import {
  ScrollView,
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Image,
  Progress,
  Badge,
  Spinner,
  Center,
} from "native-base";
import { useLocalSearchParams } from "expo-router";

interface DetalhesPokemon {
  name: string;
  id: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
}

export default function DetalhesScreen({ route }: any) {
  const { nomePokemon } = useLocalSearchParams();

  const [pokemon, setPokemon] = useState<DetalhesPokemon | null>(null); // dados do poke (inicialmnete vaizio)
  const [carregando, setCarregando] = useState(true);

  // buscando dados do poke na api
  const buscarDetalhesPokemon = async (pokemonNome: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNome.toLowerCase()}`);

      const dados: DetalhesPokemon = await response.json();

      setPokemon(dados);
    } catch (erro) {
      console.error("Erro ao buscar detalhes:", erro);
    } finally {
      setCarregando(false);
    }
  };

useEffect(() => {
  if (nomePokemon) {
    buscarDetalhesPokemon(nomePokemon as string);
  }
}, [nomePokemon]);
 // so executa se nome pokeom mudar

  // carregamento de tela
  if (carregando) {
    return (
      <Center flex={1} bg="gray.50">
        <VStack space={4} alignItems="center">
          <Spinner size="lg" color="red.500" />
          <Text color="gray.500">Carregando detalhes...</Text>
        </VStack>
      </Center>
    );
  }
  if (!pokemon) {
    return (
      <Center flex={1} bg="gray.50">
        <Text>Erro ao carregar Pokémon :( </Text>
      </Center>
    );
  }

  // url da imagem
  const urlImagem =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  return (
    <ScrollView flex={1} bg="gray.50">
      <VStack space={4} p={4}>
        <Box bg="white" borderRadius="xl" p={6} shadow={2}>
          <VStack space={3} alignItems="center">
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="gray.800"
              textTransform="capitalize"
            >
              {pokemon.name}
            </Text>
            <Text fontSize="lg" color="gray.500">
              #{pokemon.id.toString().padStart(3, "0")}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
}
