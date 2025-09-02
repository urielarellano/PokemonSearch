import { Pokemon } from '../types/Pokemon';
import './PokeGallery.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import CheckButton from "./CheckButton";

type PokeGridProps = {
    pokemons: Pokemon[];
}

function PokeGallery({ pokemons }: PokeGridProps) {
    const navigate = useNavigate();
    const [showShiny, setShowShiny] = useState(false);
    const [loadedImages, setLoadedImages] = useState<{[key:number]: boolean}>({});

    const toDetailedView = (id: number) => {
        navigate(`/${id}`);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            pokemons.forEach(pokemon => {
            const img = new Image();
            img.src = pokemon.shinyArtwork;
            });
        }, 1500); // 3000ms = 3 seconds delay

        // Cleanup if the component unmounts before timeout
        return () => clearTimeout(timer);
    }, [pokemons]);

    return (
        <div>
            <CheckButton checked={showShiny} setChecked={setShowShiny}/>
            <div className="poke-gallery">
                {pokemons.map((pokemon) => (
                    <img 
                    className={`artwork ${loadedImages[pokemon.id] ? "loaded" : ""}`}
                    key={pokemon.id}
                    src={showShiny ? pokemon.shinyArtwork : pokemon.artwork}
                    alt={`${pokemon.name} artwork`}
                    onLoad={() => setLoadedImages(prev => ({ ...prev, [pokemon.id]: true }))}
                    onClick={() => toDetailedView(pokemon.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default PokeGallery;