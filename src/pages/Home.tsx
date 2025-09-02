import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css';
import Dropdown from '../components/Dropdown';
import PokeGrid from '../components/PokeGrid';
import MobileHeader from '../components/MobileHeader';
import { Pokemon } from '../types/Pokemon';

import { getPokemon } from '../services/getPokemon';

function Home() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const searchRef = useRef<HTMLInputElement>(null);
    const [pokeArray, setPokeArray] = useState<Pokemon[]>([]);
    const [allPokemon, setAllPokemon] = useState<{ name: string; url: string }[]>([]);
    const [filtered, setFiltered] = useState<{ name: string; url: string }[]>([]);
    
    const [dropdownValue, setDropdownValue] = useState("Pokedex");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [showShiny, setShowShiny] = useState(false);

    // gallery button goes to gallery page
    const goToGallery = () => {
        navigate("/gallery");
    }

    // fetch all pokemon names on initial page load
    useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=1025")
        .then(res => res.json())
        .then(data => {
            setAllPokemon(data.results)
        })
        .catch(err => console.error(err));
    }, []);

    // function: get a Pokemon's info by name or id, then add it to pokeArray
    async function addPokemon(nameOrId: string | number) {
        try {
            const pokemon: Pokemon = await getPokemon(nameOrId); // can be "pikachu" or 25
            
            setPokeArray(prev => {
                if (prev.some(p => p.id === pokemon.id)) {
                    console.log("Already added:", pokemon.name);
                    return prev; // return unchanged array
                }
                return [...prev, pokemon];
            });
        } catch (err) {
            console.error("Failed to fetch Pokémon:", err);
        }
    }

    // function: fill in pokeArray with pokemon in filtered
    const fetchAll = async () => {
        try {
            const results = await Promise.all(
                filtered.map(p => getPokemon(p.name)) // fetch each Pokémon by name
            );
            setPokeArray(results); // update grid with full Pokémon objects
        } catch (err) {
            console.error(err);
        }
    };


    /////////////////// Search bar functionality ///////////////////////////

    // function: update filtered when user types into search bar
    const handleSearchType = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleSearchType running');
        const value = event.target.value.trim();
        const q = value.toLowerCase();
        const matches = allPokemon
            .filter(p => p.name.includes(q))
            .slice(0, 20); // max 20 results
        setFiltered(matches);
        setSearchText(value);
    };

    // update pokeArray and display Pokemon whenever filtered changes
    useEffect(() => {
        if (filtered.length === 0) {
            setPokeArray([]);
            return;
        }
        fetchAll();
    }, [filtered]);


    ///////////////// Sort by Name/Pokedex Number functionality ////////////////////////

    const radioRef = useRef<HTMLInputElement>(null);

    // arrange allPokemon by name A-Z or by pokedex num whenever dropdownValue changes
    useEffect(() => {
        if (radioRef.current) {
            radioRef.current.click(); // restore Ascending sort order
            fetch("https://pokeapi.co/api/v2/pokemon/?limit=1025")
            .then(res => res.json())
            .then(data => {
                if (dropdownValue === "Pokedex") {
                    setAllPokemon(data.results);
                } else {
                    data.results.sort((a: { name: string; url: string }, b: { name: string; url: string }) => 
                        a.name.localeCompare(b.name)
                    );
                    setAllPokemon(data.results);
                }
            })
            .catch(err => console.error(err));
        }
    }, [dropdownValue]);


    ////////////////// 'Ascending/descending' functionality //////////////////////////

    // change sortOrder when ascending or descending is clicked
    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSortOrder(value === "option1" ? "asc" : "desc");
    };

    // reverse sort order when asc/desc is clicked and update pokemon grid
    useEffect(() => {
        setAllPokemon([...allPokemon].reverse());
    }, [sortOrder]);
    useEffect(() => {
        if (searchText === "") {
            handleSearchType({ target: { value: " " } } as React.ChangeEvent<HTMLInputElement>);
        } else {
            handleSearchType({ target: { value: searchText } } as React.ChangeEvent<HTMLInputElement>);
        }
    }, [allPokemon]);


    // function: open detailed view?
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchText.trim()) {
            addPokemon(searchText.trim().toLowerCase()); 
        }
    };


    return (
        <div className="home">
            
            <h1>The Best Pokémon Search Website on the Motherf*ckin Internet</h1>
            <h2>Click a Pokemon card to see detailed info</h2>
            <div className="search-gallery-buttons">
                <button className="to-gallery" onClick={goToGallery}>Gallery</button>
            </div>
            <br />
            
            <form className="search" onSubmit={handleSearchSubmit}>
                <input ref={searchRef} 
                    type="search" 
                    placeholder="Search Pokémon name..."
                    onChange={handleSearchType}
                />
            </form>
            
            <br />
            <div className="sort-results">
                <Dropdown onChange={setDropdownValue}/>
                <div className="ascend-descend-buttons">
                    <label>
                        <input type="radio" 
                            name="option" 
                            value="option1"
                            checked={sortOrder === "asc"}
                            onChange={handleSortChange}
                            ref={radioRef}
                        />
                        <p>Ascending</p>
                    </label>

                    <label>
                        <input type="radio" 
                            name="option" 
                            value="option2"
                            checked={sortOrder === "desc"}
                            onChange={handleSortChange} 
                        />
                        <p>Descending</p>
                    </label>
                </div>
            </div>
            <MobileHeader/>
            
            <br />
            <PokeGrid pokemons={pokeArray} checked={showShiny} setChecked={setShowShiny} />
        </div>
    );
}

export default Home;