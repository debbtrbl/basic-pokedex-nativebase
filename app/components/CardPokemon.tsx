import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Pressable,
  Spinner,
  Image,
  Center
} from 'native-base';

interface PropsCardPokemon {
  pokemon: {
    name: string;
    url: string;
  };
  numero: number;
  onPress: () => void;
}

export const coresPorTipo: { [key: string]: string } = {
  normal: 'gray.400',
  fire: 'orange.500',
  water: 'blue.500', 
  electric: 'yellow.500',
  grass: 'green.500',
  ice: 'cyan.400',
  fighting: 'red.600',
  poison: 'purple.500',
  ground: 'amber.600',
  flying: 'indigo.400',
  psychic: 'pink.500',
  bug: 'green.600',
  rock: 'gray.600',
  ghost: 'violet.500',
  dragon: 'orange.400',
  dark: 'gray.800',
  steel: 'blue.200',
  fairy: 'pink.300',
};

export default function CardPokemon({ 
  pokemon, 
  numero, 
  onPress 
}: PropsCardPokemon) {
  const [tipoPokemon, setTipoPokemon] = useState<string>('normal');
  const [carregandoTipo, setCarregandoTipo] = useState(true);
  const [imagemPokemon, setImagemPokemon] = useState<string>('');

  // buscando tipo e imagem
  useEffect(() => {
    const buscarDetalhesPokemon = async () => {
      try {
        const resposta = await fetch(pokemon.url);
        const dados = await resposta.json();
        const tipo = dados.types[0]?.type?.name || 'normal';
        const imagem = dados.sprites.other['official-artwork'].front_default || 
                      dados.sprites.front_default;
        
        setTipoPokemon(tipo);
        setImagemPokemon(imagem);
      } catch (erro) {
        setTipoPokemon('normal');
        setImagemPokemon('');
      } finally {
        setCarregandoTipo(false);
      }
    };

    buscarDetalhesPokemon();
  }, [pokemon.url]);

  const corFundo = coresPorTipo[tipoPokemon] || 'gray.400';

  // loading enquanto busca os dados
  if (carregandoTipo) {
    return (
      <Box 
        bg="white" 
        p={4} 
        m={1} 
        borderRadius="xl" 
        shadow={2}
        width="48%"
        justifyContent="center"
        style={{aspectRatio: 1}}
      >
        <Center>
          <VStack space={2} alignItems="center">
            <Spinner size="sm" color="gray.400" />
            <Text color="gray.500" fontSize="xs">Carregando...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Pressable 
      onPress={onPress}
      width="48%"
      m={1}
    >
      {({ isPressed }) => (
        <Box 
          bg={corFundo}
          p={3}
          borderRadius="2xl"
          shadow={3}
          opacity={isPressed ? 0.8 : 1}
          style={{
            aspectRatio: 1,
            transform: [{ scale: isPressed ? 0.95 : 1 }]
          }}
          overflow="hidden"
        >
          <VStack flex={1} justifyContent="space-between">
            
            {/* Cabeçalho com número e nome */}
            <HStack justifyContent="space-between" alignItems="flex-start">
              <Text 
                color="white" 
                fontSize="xs" 
                fontWeight="bold"
                opacity={0.9}
              >
                #{numero.toString().padStart(3, '0')}
              </Text>
            </HStack>

            {/* Nome do Pokémon */}
            <Text 
              color="white" 
              fontSize="sm" 
              fontWeight="bold"
              textTransform="capitalize"
              numberOfLines={1}
            >
              {pokemon.name}
            </Text>

            {/* Imagem do Pokémon */}
            <Center flex={1}>
              {imagemPokemon ? (
                <Image
                  source={{ uri: imagemPokemon }}
                  alt={pokemon.name}
                  size="lg"
                  resizeMode="contain"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  }}
                />
              ) : (
                <Text color="white" fontSize="xs" opacity={0.7}>
                  Sem imagem
                </Text>
              )}
            </Center>

            {/* Tipo */}
            <Box 
              bg="white" 
              px={2} 
              py={1} 
              borderRadius="full" 
              alignSelf="flex-start"
              opacity={0.9}
            >
              <Text 
                fontSize="xs" 
                fontWeight="bold" 
                textTransform="capitalize"
                color={corFundo}
              >
                {tipoPokemon}
              </Text>
            </Box>
          </VStack>
        </Box>
      )}
    </Pressable>
  );
}