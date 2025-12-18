import { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { Route, Routes, useNavigate } from "react-router-dom";
import Game from "./components/Game";
import Home from "./components/Home";
import Nav from "./components/Nav";

function AppRoutes() {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id") ?? undefined;

  useEffect(() => {
    if (id) {
      navigate("/game/vs");
    }
  }, []);

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/ai" element={<Game vsAi={true} />} />
        <Route path="/game/vs" element={<Game vsAi={false} connectingTo={id} />} />
      </Routes>
      <a
        href="https://github.com/alexbarker234/connect4-react"
        target="_blank"
        rel="noreferrer"
        className="github-icon"
      >
        <FaGithub size={30} />
      </a>
    </>
  );
}

export default AppRoutes;
