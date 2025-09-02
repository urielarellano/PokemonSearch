import React from 'react';
import { useState, useRef, useEffect } from "react";
import './Dropdown.css';

type DropdownProps = {
        onChange?: (value: string) => void;
};

function Dropdown({ onChange }: DropdownProps) {

    const [open, setOpen] = useState(false);
    const [dropValue, setDropValue] = useState("Pokedex");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // close dropdown when value is selected, update dropValue
    const handleSelect = (value: string) => {
        setDropValue(value);
        onChange?.(value);
        setOpen(false); // close the dropdown
    };

    // close dropdown menu when user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const dropArrow = document.querySelector('.drop-arrow') as HTMLDivElement | null;
        if (open) {
            if (dropArrow) {
                dropArrow.style.transform = 'rotate(270deg)';
            }
        } else {
            if (dropArrow) {
                dropArrow.style.transform = 'rotate(90deg)';
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });


    return(
        <div className="drop-choice" data-value={dropValue} ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
            <button className="dropdown-button" onClick={() => setOpen(!open)}>
                <p>Sort by: {dropValue}</p>
                <span className="drop-arrow">&#10095;</span>
            </button>

            {open && (
                <div className="dropdown-menu">
                    <button onClick={() => handleSelect("Name")}>Name (A-Z)</button>
                    <button onClick={() => handleSelect("Pokedex")}>Pokédex Number</button>
                </div>
            )}
        </div>
    );
}

export default Dropdown;