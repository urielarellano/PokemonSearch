import { useState } from "react";
import "./CheckButton.css";

type CheckButtonProps = {
    checked: boolean;
    setChecked: (value: boolean) => void;
}

function CheckButton({ checked, setChecked }: CheckButtonProps) {

  return (
    <button className={`shiny-check ${checked ? "checked" : ""}`}
      onClick={() => setChecked(!checked)}
      
    >
      {checked ? "✔ Shiny" : "☐ Shiny"}
    </button>
  );
}

export default CheckButton;
