import React, { useEffect, useState } from "react";
import './MobileHeader.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 290 && !scrolled) {
        setScrolled(true);
      } else if (y <= 290 && scrolled) {
        setScrolled(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrolled]);

  return (
    <div
      className="black-background"
      style={{ display: scrolled && isMobile ? "flex" : "none" }}
    >
      {/* content */}
    </div>
  );
}
