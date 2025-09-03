import axios from "axios";
import { Pokemon } from "../types/Pokemon";

export async function getPokemon(idOrName: number | string): Promise<Pokemon> {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
    const data = response.data;

    let sprite: string;
    let shinySprite: string;

    if (data.id >= 932) {
      sprite = data.sprites.front_default || "";
      shinySprite = data.sprites.front_shiny || "";
    } else if (data.id >= 650) {
      sprite = data.sprites.other["showdown"].front_default || "";
      shinySprite = data.sprites.other["showdown"].front_shiny || "";
    } else {
      sprite =
        data.sprites.versions["generation-v"]["black-white"]["animated"].front_default || "";
      shinySprite =
        data.sprites.versions["generation-v"]["black-white"]["animated"].front_shiny || "";
    }

    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      type: data.types.map((t: any) => t.type.name),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: {
        HP: data.stats.find((s: any) => s.stat.name === "hp")?.base_stat || 0,
        Attack: data.stats.find((s: any) => s.stat.name === "attack")?.base_stat || 0,
        Defense: data.stats.find((s: any) => s.stat.name === "defense")?.base_stat || 0,
        SpAttack: data.stats.find((s: any) => s.stat.name === "special-attack")?.base_stat || 0,
        SpDefense: data.stats.find((s: any) => s.stat.name === "special-defense")?.base_stat || 0,
        Speed: data.stats.find((s: any) => s.stat.name === "speed")?.base_stat || 0,
      },
      sprite,
      shinySprite,
      artwork: data.sprites.other["official-artwork"].front_default,
      shinyArtwork: data.sprites.other["official-artwork"].front_shiny,
    };

    return pokemon;
  } catch (error: any) {
    throw new Error("Pokemon not found");
  }
}
