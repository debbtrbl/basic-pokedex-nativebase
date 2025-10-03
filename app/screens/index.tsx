import { MaterialIcons } from "@expo/vector-icons";
import {
  Box,
  Button,
  HStack,
  Input,
  Center, 
  Spinner, 
  Text, 
  VStack
} from "native-base";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import CardPokemon from "../components/CardPokemon";
import { useRouter } from "expo-router";

interface Pokemon {
  name: string; 
  url: string;   
}

export default function HomeScreen() {
    const router = useRouter();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');
  const [offset, setOffset] = useState(0); // offset = 0 (primeira página)
  const limite = 20; // quantidade de pokemon por página

  // buscar lista de pikamon
  const buscarPokemons = async (novoOffset: number) =>{
    setCarregando(true); // comeca a carragr
    try{
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${novoOffset}`);
      const dados = await response.json();

      setPokemons(dados.results);
      setOffset(novoOffset); // atualiza a pag atual

    } catch (error) {
      console.error('Error ao buscar Pokémon:', error);
    } finally {
      setCarregando(false); // para de carregar
    }
  };

  // buscar pikamon por nome
  const buscarPokemonPorNome = async () => {
    if (!textoBusca.trim()) {
      buscarPokemons(0); // se input de busca tiver vazio fica na primeira pag
      return;
    }

    setCarregando(true);
    try{
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${textoBusca.toLowerCase()}`);
      if (response.status === 404) {
        Alert.alert('Pokémon não encontrado!');
        return;
      }
      const dadosPokemon = await response.json(); // guarda dados do poke encontado
      router.push({
        pathname: './DetalhesScreen',
        params: { pokemonNome: dadosPokemon.name }
      });  

  } catch (erro){
    Alert.alert('Erro', 'Pokémon não encontrado!');
  } finally {
      setCarregando(false); 
      setTextoBusca(''); // limpa input de busca
    }
};

useEffect(() => {
  buscarPokemons(0); // qnd carregar pela primera vez busca a primeira pag
}, []);

const renderizarItemPokemon = ({ item, index }: { item: Pokemon; index: number }) => (
  <CardPokemon
    pokemon={item}
    numero={offset + index + 1}
    onPress={() => router.push({
    pathname: '/screens/DetalhesScreen',
    params: { pokemonNome: item.name }
})}
  />
);

  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Box safeArea flex={1} bg="gray.100">

          {/* header */}
          <Box bg="red.500" py={4} px={6} shadow={1} rounded="xl">
            <Text color="white" fontSize="2xl" fontWeight="bold" textAlign="center">Pokédex Linda</Text>
          </Box>

          {/* barra de busca*/}
          <Box p={4} bg='white' shadow={1}>
            <VStack space={2}>
          <Text fontSize="md" fontWeight="medium" color="gray.600">
            Buscar Pokémon
          </Text>
          <HStack space={2}>
            <Input
              flex={1} 
              placeholder="Digite o nome do Pokémon..."
              value={textoBusca}
              onChangeText={setTextoBusca} 
              onSubmitEditing={buscarPokemonPorNome} 
              bg="gray.50"
              borderRadius="lg"
            />
            <Button 
              onPress={buscarPokemonPorNome} 
              isLoading={carregando} 
              bg="red.500"
              borderRadius="lg"
              _pressed={{ bg: "red.600" }} 
            >
              Buscar
            </Button>
          </HStack>
        </VStack>
          </Box>

          {/* lista de pokemon e loading */}
          <Box flex={1} p={2}>
            {carregando && pokemons.length === 0 ? (
          <Center flex={1}>
            <VStack space={4} alignItems="center">
              <Spinner size="lg" color="red.500" />
              <Text color="gray.500">Carregando Pokémon...</Text>
            </VStack>
          </Center>
        ): (
          <FlatList
            data={pokemons} // Dados da lista
            renderItem={renderizarItemPokemon} 
            keyExtractor={(item) => item.name} 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 20 }} 
          />
        )}
          </Box>

          {/* botoes de pag */}

          <Box p={4} bg="white" borderTopWidth={1} borderTopColor="gray.200"></Box>
            <HStack justifyContent="space-between" space={4}>
               <Button
            flex={1}
            onPress={() => buscarPokemons(Math.max(0, offset - limite))}
            isDisabled={offset === 0 || carregando} // desabilita se ta na primeira página
            bg="gray.500"
            _disabled={{ bg: "gray.300" }} 
            borderRadius="lg"
          >
            <Text color="white">Anterior</Text>
          </Button>
          <Button
            flex={1}
            onPress={() => buscarPokemons(offset + limite)}
            isLoading={carregando}
            bg="red.500"
            borderRadius="lg"
            _pressed={{ bg: "red.600" }}
          >
            <Text color="white">Próxima</Text>
          </Button>
            </HStack>
          
        </Box>
      </KeyboardAvoidingView>
  );
}
