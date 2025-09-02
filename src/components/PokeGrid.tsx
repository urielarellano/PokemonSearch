import { Pokemon } from '../types/Pokemon';
import './PokeGrid.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import CheckButton from './CheckButton';

type PokeGridProps = {
    pokemons: Pokemon[];
    checked: boolean;
    setChecked: (value: boolean) => void;
}

function PokeGrid({ pokemons, checked, setChecked }: PokeGridProps) {
  const navigate = useNavigate();
  const [showShiny, setShowShiny] = useState(false);

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

  useEffect(() => {
      const timer = setTimeout(() => {
          pokemons.forEach(pokemon => {
          const img = new Image();
          img.src = pokemon.shinySprite;
          });
      }, 1500); // 3000ms = 3 seconds delay

      // Cleanup if the component unmounts before timeout
      return () => clearTimeout(timer);
  }, [pokemons]);
  
  return (
    <div>
      <CheckButton checked={showShiny} setChecked={setShowShiny}/>
      <div className="pokeGrid">
        {pokemons.map((pokemon) => (
          <div className="pokemonCard" 
                data-id={pokemon.id} 
                key={pokemon.id}
                onClick={() => {toDetailedView(pokemon.id)}}
          >
            <h2>{pokemon.name} (#{pokemon.id})</h2>

            <div className="sprite" style={{ display: "flex", justifyContent: "center" }}>
              <img src={showShiny ? pokemon.shinySprite : pokemon.sprite} alt={`${pokemon.name} sprite`} />
            </div>

            <p><strong>Type:</strong> {pokemon.type.join(", ")}</p>
            
            <p><strong>Abilities:</strong> {pokemon.abilities.join(", ")}</p>

            <div>
              <h3>Stats</h3>
              <ul className="stats-list">
                {Object.entries(pokemon.stats).map(([statName, statValue]) => {
                  const percentage = (statValue / 255) * 100; // calculate width %
                  const colorClass = getStatColorClass(statValue);
                  
                  return (
                    <li key={statName}>
                      <span className="stat-name">{statName}</span>
                      <div className="stat-bar-container">
                        <div
                          className={`stat-bar-fill ${colorClass}`}
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokeGrid;