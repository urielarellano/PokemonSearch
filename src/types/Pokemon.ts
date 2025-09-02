export type Stats = {
    HP: number;
    Attack: number;
    Defense: number;
    SpAttack: number;
    SpDefense: number;
    Speed: number;
}

export type Pokemon = {
    id: number;
    name: string;
    type: string[];
    height: number;
    weight: number;
    abilities: string[];
    stats: Stats;

    sprite: string;
    shinySprite: string;
    artwork: string;
    shinyArtwork: string;
};