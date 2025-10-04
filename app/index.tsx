import { MaterialIcons } from "@expo/vector-icons";
import {
  Box,
  Button,
  HStack,
  Input,
  Center, 
  Spinner, 
  Text, 
  VStack, Modal, ScrollView, Image, Badge
} from "native-base";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, FlatList, Dimensions } from "react-native";
import CardPokemon, { coresPorTipo } from './components/CardPokemon';

interface Pokemon {
  name: string; 
  url: string;   
}

interface PokemonDetalhes {
    name: string;
    id: number;
    sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
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
}

export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pokemonSelecionado, setPokemonSelecionado] = useState<PokemonDetalhes | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [offset, setOffset] = useState(0); // offset = 0 (primeira página)
  const limite = 20; // quantidade de pokemon por página
  const [erroBusca, setErroBusca] = useState(false) 

  // buscar lista de pikamon
  const buscarPokemons = async (novoOffset: number) =>{
    setCarregando(true); // comeca a carragr
    setErroBusca(false); 
    try{
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${novoOffset}`);
      const dados = await response.json();

      setPokemons(dados.results);
      setOffset(novoOffset); // atualiza a pag atual

    } catch (error) {
      console.error('Error ao buscar Pokémon:', error);
      setErroBusca(true);
    } finally {
      setCarregando(false); // para de carregar
    }
  };

  // buscar detalhes do poke pro modal
  const buscarDetalhesPokemon = async (pokemonNome: string) => {
    setCarregandoDetalhes(true);
    try{
        const response = await  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNome.toLowerCase()}`);
         if (response.status === 404) {
        Alert.alert('Pokémon não encontrado!');
        return;
      }
      const dadosPokemon = await response.json();
      setPokemonSelecionado(dadosPokemon); // armazena dados em pokemonSelecionado
      setModalVisivel(true); // mostra modal
    } catch (erro) {
        Alert.alert('Erro', 'Erro ao carregar detalhes do pokémon!')
    } finally {
        setCarregandoDetalhes(false)
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
      setPokemonSelecionado(dadosPokemon);
      setModalVisivel(true); // abre modal
  } catch (erro){
    Alert.alert('Erro', 'Pokémon não encontrado!');
  } finally {
      setCarregando(false); 
      setTextoBusca(''); // limpa input de busca
    }
};

// formata os nomes das estatisticas p port
const formatarNomeEstatistica = (estatisticaNome: string) => {
    const statMap: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defesa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defesa Especial',
      'speed': 'Velocidade'
    };
    return statMap[estatisticaNome] || estatisticaNome;
}

// obter a cor de cada tipo (importando as cores do cardPokemon)
const getCorTipo = (tipo: string) => {
    return coresPorTipo[tipo] || 'gray.400';
};

useEffect(() => {
  buscarPokemons(0); // qnd carregar pela primera vez busca a primeira pag
}, []);

const renderizarItemPokemon = ({ item, index }: { item: Pokemon; index: number }) => (
    <CardPokemon
      pokemon={item}
      numero={offset + index + 1}
      onPress={() => buscarDetalhesPokemon(item.name)}
    />
  );;

  const renderizarErro = () => (
  <Center flex={1}>
    <VStack space={4} alignItems="center">
      <Text color="red.500" fontSize="lg">Erro ao carregar Pokémon</Text>
      <Text color="gray.500" textAlign="center">
        Verifique sua conexão e tente novamente
      </Text>
      <Button 
        onPress={() => buscarPokemons(offset)} 
        bg="red.500"
        borderRadius="lg"
      >
        <Text color="white">Tentar Novamente</Text>
      </Button>
    </VStack>
  </Center>
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
            {erroBusca ? ( renderizarErro() // mostra botao tente novemnete se der ero
            ) :carregando && pokemons.length === 0 ? (
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
            numColumns={2}
            columnWrapperStyle={{  justifyContent: 'space-between'}}
          />
        )}
          </Box>

          {/* botoes de pag */}

          <Box p={4} bg="white" borderTopWidth={1} borderTopColor="gray.200">
            <HStack justifyContent="space-between" space={4}>
               <Button
            flex={1}
            onPress={() => buscarPokemons(Math.max(0, offset - limite))}
            isDisabled={offset === 0 || carregando} // desabilita se ta na primeira página
            bg="red.500"
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

        {/* modal de detalhes do poke */}
        <Modal 
        isOpen={modalVisivel}
        onClose={() => setModalVisivel(false)}
        size={"lg"}
        avoidKeyboard>
            <Modal.Content maxWidth={"400px"}>
                {carregandoDetalhes? (
                    <Modal.Body>
                        <Center py={8}>
                            <VStack space={4} alignItems="center">
                                <Spinner size="lg" color="red.500" />
                                <Text color="gray.500">Carregando detalhes...</Text>
                            </VStack>
                        </Center>
                    </Modal.Body>
                ) : pokemonSelecionado && (
                    <>
                <Modal.CloseButton />
                <Modal.Header>
                  <Text fontSize="xl" fontWeight="bold" textTransform="capitalize">
                    {pokemonSelecionado.name}
                  </Text>
                </Modal.Header>
                <Modal.Body>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <VStack space={4}>
                      
                      {/* imagem */}
                      <Center>
                        <Image
                          source={{
                            uri: pokemonSelecionado.sprites.other['official-artwork'].front_default || 
                                 pokemonSelecionado.sprites.front_default
                          }}
                          alt={pokemonSelecionado.name}
                          size="2xl"
                          resizeMode="contain"
                        />
                      </Center>

                      {/* numero */}
                      <Center>
                        <Text color="gray.500" fontSize="md">
                          #{pokemonSelecionado.id.toString().padStart(3, '0')}
                        </Text>
                      </Center>

                      {/* tipos */}
                      <HStack space={2} justifyContent="center">
                        {pokemonSelecionado.types.map((typeInfo, index) => (
                          <Badge
                            key={index}
                            bg={getCorTipo(typeInfo.type.name)}
                            variant="solid"
                            rounded="full"
                            px={3}
                            py={1}
                          >
                            <Text color="white" fontSize="sm" textTransform="capitalize">
                              {typeInfo.type.name}
                            </Text>
                          </Badge>
                        ))}
                      </HStack>

                      {/* infos */}
                      <HStack justifyContent="space-around" bg="gray.50" p={3} rounded="lg">
                        <VStack alignItems="center">
                          <Text fontWeight="bold" color="gray.600">Altura</Text>
                          <Text>{(pokemonSelecionado.height / 10).toFixed(1)} m</Text>
                        </VStack>
                        <VStack alignItems="center">
                          <Text fontWeight="bold" color="gray.600">Peso</Text>
                          <Text>{(pokemonSelecionado.weight / 10).toFixed(1)} kg</Text>
                        </VStack>
                      </HStack>

                      {/* habilidades */}
                      <Box>
                        <Text fontWeight="bold" color="gray.600" mb={2}>Habilidades</Text>
                        <HStack space={2} flexWrap="wrap">
                          {pokemonSelecionado.abilities.map((ability, index) => (
                            <Badge
                              key={index}
                              colorScheme="blue"
                              variant="outline"
                              rounded="full"
                              px={3}
                              py={1}
                            >
                              <Text fontSize="sm" textTransform="capitalize">
                                {ability.ability.name}
                              </Text>
                            </Badge>
                          ))}
                        </HStack>
                      </Box>

                      {/* status */}
                      <Box>
                        <Text fontWeight="bold" color="gray.600" mb={2}>Estatísticas</Text>
                        <VStack space={2}>
                          {pokemonSelecionado.stats.map((stat, index) => (
                            <Box key={index}>
                              <HStack justifyContent="space-between" mb={1}>
                                <Text fontSize="sm" textTransform="capitalize">
                                  {formatarNomeEstatistica(stat.stat.name)}
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {stat.base_stat}
                                </Text>
                              </HStack>
                              <Box
                                bg="gray.200"
                                h={2}
                                rounded="full"
                                overflow="hidden"
                              >
                                <Box
                                  bg="red.500"
                                  h="100%"
                                  rounded="full"
                                  width={`${Math.min(100, (stat.base_stat / 255) * 100)}%`}
                                />
                              </Box>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    </VStack>
                  </ScrollView>
                </Modal.Body>
              </>
                )
                }
            </Modal.Content>

        </Modal>


        </Box>
      </KeyboardAvoidingView>
  );
}