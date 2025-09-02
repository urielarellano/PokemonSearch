import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pokemon } from '../types/Pokemon';
import { getPokemon } from '../services/getPokemon';
import { useRandPokeArray } from '../hooks/useRandPokeArray';
import { useFilteredPokeArray } from '../hooks/useFilteredPokeArray';
import PokeGallery from '../components/PokeGallery';
import './Gallery.css';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// filter by type
// filter by legendary/mythical
// filter by baby
// filter by generation
// https://pokeapi.co/api/v2/pokemon-species/249

function Gallery() {
    const navigate = useNavigate();
    const [numPokemon, setNumPokemon] = useState(20);
    const noFilterArray = useRandPokeArray(numPokemon);
    const [pokeArray, setPokeArray] = useState<Pokemon[]>(noFilterArray);
    
    // filter options
    const [gen, setGen] = useState<number>(10);
    const [type, setType] = useState<string>("");
    const [isLegendary, setIsLegendary] = useState<boolean>(false);

    const filteredPokeArray = useFilteredPokeArray(numPokemon, isLegendary, gen, type);

    const toSearch = () => {
        navigate("/");
    }

    // functions to update gen/type/isLegendary on clicks
    const handleGen = (chosenGen: number) => {
        if (gen === chosenGen) {
            setGen(10);
        } else {
            setGen(chosenGen);
        }
    };
    const handleType = (chosenType: string) => {
        if (type === chosenType) {
            setType("");
        } else {
            setType(chosenType);
        }
    };
    const handleLegendary = (chosenIsLegendary: boolean) => {
        setIsLegendary(chosenIsLegendary);
    };

    // isLegendary: boolean, gen: number, type: string
    useEffect(() => {
        if (gen !== 10 || type !== "" || isLegendary) {
            setPokeArray(filteredPokeArray);
            console.log("merp");
        } else {
            setPokeArray(noFilterArray);
        }
    }, [gen, type, isLegendary, filteredPokeArray, noFilterArray]);


    const gens = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const types = [
        "normal",
        "fire",
        "water",
        "grass",
        "electric",
        "ice",
        "fighting",
        "poison",
        "ground",
        "flying",
        "psychic",
        "bug",
        "rock",
        "ghost",
        "dragon",
        "dark",
        "steel",
        "fairy"
    ];
    

    return(
        <div className="gallery-page">
            <button className="to-search" onClick={toSearch}>&#8592; Search</button>
            <h1>Pokemon Gallery</h1>
            <div className="generation-filter">
                <h3>Filter genearation:</h3>
                <div className="gens">
                    {gens.map((chosenGen) => (
                        <button
                            key={chosenGen}
                            onMouseDown={() => handleGen(chosenGen)}
                            className={gen === chosenGen ? "active" : ""}
                        >
                        Gen {chosenGen}
                        </button>
                    ))}
                </div>
            </div>
            <div className="type-filter">
                <h3>Filter type:</h3>
                <div className="types">
                    {types.map((chosenType) => (
                        <button
                            key={chosenType}
                            onMouseDown={() => {handleType(chosenType)}}
                            className={type === chosenType ? `${chosenType} active` : `${chosenType}`}
                        >
                        {capitalize(chosenType)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="legendary-mythical-filter">
                <h3>Filter legendary/mythical:</h3>
                <button
                    onMouseDown={() => {handleLegendary(!isLegendary)}}
                    className={isLegendary ? `legendary active` : `legendary`}
                >
                    Legendary/Mythical
                </button>
            </div>
            <br />
            <PokeGallery pokemons={pokeArray}/>
        </div>
    );
}

export default Gallery;