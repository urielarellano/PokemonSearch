import { useState, useEffect } from "react";
import { Pokemon } from '../types/Pokemon';
import { getPokemon } from '../services/getPokemon';

// Array of Legendary & Mythical Pokémon Pokédex numbers (up to Gen IX)
const legendaryMythical: number[] = [
  // Gen 1
  144, 145, 146, 150, 151,
  // Gen 2
  243, 244, 245, 249, 250, 251,
  // Gen 3
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
  // Gen 4
  480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
  // Gen 5
  494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
  // Gen 6
  716, 717, 718, 719, 720, 721,
  // Gen 7
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809,
  // Gen 8
  888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905,
  // Gen 9
  1001, 1002, 1003, 1004, 1007, 1008, 1009, 1010, 1014, 1015, 1016, 1017, 1020, 1021, 1022, 1023, 1024, 1025
];

// Generation ranges (inclusive)
const genRanges: [number, number][] = [
  [1, 151],    // Gen 1 (Kanto)
  [152, 251],  // Gen 2 (Johto)
  [252, 386],  // Gen 3 (Hoenn)
  [387, 493],  // Gen 4 (Sinnoh)
  [494, 649],  // Gen 5 (Unova)
  [650, 721],  // Gen 6 (Kalos)
  [722, 809],  // Gen 7 (Alola)
  [810, 905],  // Gen 8 (Galar)
  [906, 1025], // Gen 9 (Paldea + DLC)
  [1, 1025] // if no gen is checked
];



//////////////////////maybe delet this//////////////////////
// Candidate pool (rebuilt when filter options change)
let candidates: number[] = [];

/**
 * Updates the candidate pool based on filters
 * @param onlyLegendaries whether to restrict to legendaries/mythicals
 * @param generation which generation filter (1–9)
 */
function updateCandidates(onlyLegendaries: boolean, generation: number) {
  const [min, max] = genRanges[generation - 1];

  if (onlyLegendaries) {
    candidates = legendaryMythical.filter(n => n >= min && n <= max);
  } else {
    candidates = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  }
}

/**
 * Returns a random Pokédex number from the current candidate pool
 */
function getRandomPokemon(): number {
  return candidates[Math.floor(Math.random() * candidates.length)];
}
////////////////////////////////////////////////////////////


/**
 * Return an array of all pokemon ids of a specified type
 * @param type type pokemon type to filter
 * @returns array of ints of all the pokemon ids of type 'type'
 */
async function getPokemonOfType(type: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
  const data = await res.json();

  // Extract Pokémon IDs and filter <= 1025
  const pokemonIds = data.pokemon
    .map((p: any) => {
      const urlParts = p.pokemon.url.split("/").filter(Boolean);
      return parseInt(urlParts[urlParts.length - 1], 10);
    })
    .filter((id: number) => id <= 1025);

  return pokemonIds; // Array of IDs
}

// return array of ids between minId and maxId (specified gen), inclusive
function getPokemonOfGen(minId: number, maxId: number): number[] {
  return Array.from({ length: maxId - minId + 1 }, (_, i) => i + minId);
}

function intersectArrays(arrays: number[][]): number[] {
  // Filter out empty arrays
  const nonEmpty = arrays.filter(arr => arr.length > 0);

  if (nonEmpty.length === 0) return []; // nothing to intersect

  // Start with the first non-empty array, then filter for common elements
  return nonEmpty.reduce((acc, arr) => acc.filter(num => arr.includes(num)));
}


export function useFilteredPokeArray(count: number, isLegendary: boolean, gen: number, type: string) {
    const [pokeArray, setPokeArray] = useState<Pokemon[]>([]);

    useEffect(() => {
        const maxCount = count;
        const [min, max] = genRanges[gen - 1];
        const genIds = getPokemonOfGen(min, max);

        const fetchAll = async () => {
            setPokeArray([]);
            let typeArr: number[] = [];

            if (type) {
                try {
                    typeArr = await getPokemonOfType(type);
                } catch (err) {
                    console.error("Failed to fetch Pokémon:", err);
                }
            }

            const filteredPokeIds = intersectArrays([
                type ? typeArr : [],
                isLegendary ? legendaryMythical : [],
                genIds
            ]);

            const shuffled = [...filteredPokeIds].sort(() => Math.random() - 0.5).slice(0, maxCount);
            const results = await Promise.all(shuffled.map(id => getPokemon(id).catch(() => null)));
            const validResults: Pokemon[] = results.filter((p): p is Pokemon => p !== null);

            setPokeArray(validResults);
        };

        fetchAll();
    }, [count, isLegendary, gen, type]);

    return pokeArray;
}