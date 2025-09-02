import { useState, useEffect } from "react";
import { Pokemon } from '../types/Pokemon';
import { getPokemon } from '../services/getPokemon';

// Generates `count` unique random numbers between 1 and 1025
function getUniqueRandomNumbers(count: number): number[] {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * 1025) + 1); // 1–1025
  }
  return Array.from(numbers);
}

// Custom hook to generate Pokémon list
export function useRandPokeArray(count: number) {
  const [pokeArray, setPokeArray] = useState<Pokemon[]>([]);

  useEffect(() => {
    const ids = getUniqueRandomNumbers(count);
    const fetchedIds = new Set<number>(); // track fetched IDs

    const fetchAll = async () => {
      setPokeArray([]); // clear old list

      for (const id of ids) {
        if (fetchedIds.has(id)) continue; // extra safety
        try {
          const pokemon = await getPokemon(id);
          if (!fetchedIds.has(pokemon.id)) {
            fetchedIds.add(pokemon.id);
            setPokeArray(prev => [...prev, pokemon]);
          }
        } catch (err) {
          console.error("Failed to fetch Pokémon:", err);
        }
      }
    };

    fetchAll();
  }, [count]);

  return pokeArray;
}