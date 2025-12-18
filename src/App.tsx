import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Home from "./components/Home";
import Game from "./components/Game";
import Nav from "./components/Nav";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Background from "./components/Background";

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
            <Background />
            <ThemeSwitcher />
        </>
    );
}

export default AppRoutes;
