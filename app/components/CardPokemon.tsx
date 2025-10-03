import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Pressable,
  Spinner
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

interface PropsCardPokemon {
  pokemon: {
    name: string;
    url: string;
  };
  numero: number;
  onPress: () => void;
}

const coresPorTipo: { [key: string]: string } = {
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

// buscando tipo
  useEffect(() => {
    const buscarTipoPokemon = async () => {
      try {
        const resposta = await fetch(pokemon.url);
        const dados = await resposta.json();
        const tipo = dados.types[0]?.type?.name || 'normal';
        setTipoPokemon(tipo);
      } catch (erro) {
        setTipoPokemon('normal');
      } finally {
        setCarregandoTipo(false);
      }
    };

    buscarTipoPokemon();
  }, [pokemon.url]);

  const corBorda = coresPorTipo[tipoPokemon] || 'gray.400';

  //  loading enquanto busca o tipo
  if (carregandoTipo) {
    return (
      <Box bg="white" p={4} m={2} borderRadius="lg" shadow={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </Text>
            <Text color="gray.500" fontSize="sm">#{numero}</Text>
          </VStack>
          <Spinner size="sm" color="gray.400" />
        </HStack>
      </Box>
    );
  }

  return (
    <Pressable onPress={onPress}>
      {({ isPressed }) => (
        <Box 
          bg={isPressed ? "gray.100" : "white"}
          p={4}
          m={2}
          borderRadius="lg"
          shadow={2}
          borderLeftWidth={4}
          borderLeftColor={corBorda}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </Text>
              <Text color="gray.500" fontSize="sm">#{numero}</Text>
              <Text color={corBorda} fontSize="xs" fontWeight="medium" textTransform="capitalize">
                {tipoPokemon}
              </Text>
            </VStack>
            <Text color={corBorda} fontSize="xl" fontWeight="bold">→</Text>
          </HStack>
        </Box>
      )}
    </Pressable>
  );
}