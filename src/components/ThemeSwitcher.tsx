import { useEffect, useState } from "react";
import "./ThemeSwitcher.scss";

function ThemeSwitcher() {
  const [darkMode, setDarkMode] = useState(true);

  // initiaialise
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (!storedMode) {
      if (!isBrowserDarkMode()) setDarkMode(false);
    } else setDarkMode(storedMode === "true");
  }, []);

  useEffect(() => {
    darkMode ? document.body.classList.remove("light") : document.body.classList.toggle("light");
  }, [darkMode]);

  const isBrowserDarkMode = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const handleChange = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  return (
    <div className="toggle-switch">
      <label>
        <input checked={darkMode} type="checkbox" onChange={handleChange} />
        <span className="slider"></span>
      </label>
    </div>
  );
}
export default ThemeSwitcher;
