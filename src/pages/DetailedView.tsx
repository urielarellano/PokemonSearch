import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Pokemon } from '../types/Pokemon';
import { Stats } from '../types/Pokemon';
import './DetailedView.css';
import { getPokemon } from '../services/getPokemon';


function DetailedView() {
    const { num } = useParams<{ num: string }>();
    const trueNum = Number(num);
    let prevNum: number;
    let nextNum: number;
    if (trueNum === 1) {
        prevNum = 1025;
    } else {
        prevNum = trueNum - 1;
    }

    if (trueNum === 1025) {
        nextNum = 1;
    } else {
        nextNum = trueNum + 1;
    }
    
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    
    const toSearch = () => {
        navigate("/");
    }

    const toGallery = () => {
        navigate("/gallery");
    }

    // get Pokemon data and put it into 'pokemon'
    async function fetchPokemonData() {
        try {
            const data = await getPokemon(trueNum);
            setPokemon(data);
        } catch (err) {
            console.error("Failed to fetch Pokemon data");
        }
    }

    // get Pokemon data on page load
    useEffect(() => {
        fetchPokemonData();
    }, [trueNum]);
    

    const toDetailedView = (id: number) => {
        navigate(`/${id}`);
    }

    function getStatColorClass(statValue: number) {
        if (statValue < 60) return "stat-low";
        if (statValue < 90) return "stat-medium-low";
        if (statValue < 120) return "stat-medium";
        if (statValue < 150) return "stat-medium-high";
        return "stat-high";
    }

    if (!pokemon) {
        return ( 
            <h1 style={{ textAlign: "center" }}>
            No Pokemon found. :(
            </h1>
        );
    }
    return (
        <div className="detailed-view">
            <div className="navigation-buttons">
                <button className="detailed-to-search" onClick={toSearch}>Search</button>
                <button className="detailed-to-gallery" onClick={toGallery}>Gallery</button>
            </div>
            
            <div className="left-button" 
                onClick={() => {toDetailedView(prevNum)}}>
                    &#8249;
            </div>
            <div className="pokemon-view">
                <h1 className="pokemon-name">{pokemon.name} (#{pokemon.id})</h1>

                <div className="detail-images">
                    <div>
                        <img
                            className="detail-artwork"
                            src={pokemon.artwork}
                            alt={`${pokemon.name} artwork`}
                        />
                        <img
                            className="detail-artwork"
                            src={pokemon.shinyArtwork}
                            alt={`${pokemon.name} shiny artwork`}
                        />
                    </div>
                    <div>
                        <img
                            className="detail-sprite"
                            src={pokemon.sprite}
                            alt={`${pokemon.name} sprite`}
                        />
                        <img
                            className="detail-shiny-sprite"
                            src={pokemon.shinySprite}
                            alt={`${pokemon.name} shiny sprite`}
                        />
                    </div>
                    <div className="other-sprites">
                        <a href={`https://pokemondb.net/pokedex/${pokemon.name}`}>
                            <img
                            src={`https://img.pokemondb.net/sprites/red-blue/normal/${pokemon.name}.png`}
                            alt={pokemon.name}
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </a>
                        <a href={`https://pokemondb.net/pokedex/${pokemon.name}`}>
                            <img
                            src={`https://img.pokemondb.net/sprites/silver/normal/${pokemon.name}.png`}
                            alt={pokemon.name}
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </a>
                        <a href={`https://pokemondb.net/pokedex/${pokemon.name}`}>
                            <img
                            src={`https://img.pokemondb.net/sprites/ruby-sapphire/normal/${pokemon.name}.png`}
                            alt={pokemon.name}
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </a>
                        <a href={`https://pokemondb.net/pokedex/${pokemon.name}`}>
                            <img
                            src={`https://img.pokemondb.net/sprites/diamond-pearl/normal/${pokemon.name}.png`}
                            alt={pokemon.name}
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </a>
                        <a className="gen-8-sprite" href={`https://pokemondb.net/pokedex/${pokemon.name}`}>
                            <img
                            src={`https://img.pokemondb.net/sprites/sword-shield/normal/${pokemon.name}.png`}
                            alt={pokemon.name}
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </a>
                    </div>
                    
                </div>

                <div className="info">
                    <p>
                        <strong>Type:</strong> 
                        <div className={`detail-type ${pokemon.type[0]}`}>
                            {pokemon.type[0]}
                        </div>
                        {pokemon.type[1] && (
                            <div className={`detail-type ${pokemon.type[1]}`}>
                                {pokemon.type[1]}
                            </div>
                        )}
                    </p>
                    <p><strong>Abilities:</strong> {pokemon.abilities.join(", ")}</p>
                </div>

                <div className="stats">
                    <h2>Stats</h2>
                    <ul className="detail-stats-list">
                        {Object.entries(pokemon.stats).map(([statName, statValue]) => {
                            const percentage = (statValue / 255) * 100; // calculate width %
                            const colorClass = getStatColorClass(statValue);
                        
                            return (
                                <li key={statName}>
                                    <span className="detail-stat-name">{statName}</span>
                                    <div className="detail-stat-bar-container">
                                        <div
                                        className={`detail-stat-bar-fill ${colorClass}`}
                                        style={{ "--stat-percent": `${percentage}%` } as React.CSSProperties}
                                        >
                                        {statValue}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <a 
                    href={`https://pokemondb.net/pokedex/${pokemon.name}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    PokemonDB
                </a>
            </div>
            <div className="right-button" 
                onClick={() => {toDetailedView(nextNum)}}>
                    &#8250;
                </div>
        </div>
    );
}

export default DetailedView;