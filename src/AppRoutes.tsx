import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";
import { useEffect } from "react";

function AppRoutes() {
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const id = queryParameters.get("id") ?? undefined;

    useEffect(() => {
        //  navigate("/game/ai");

        // if (id) {
        //     navigate("/game/vs");
        // }
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/ai" element={<Game vsAi={true} />} />
            <Route path="/game/vs" element={<Game vsAi={false} connectingTo={id} />} />
        </Routes>
    );
}

export default AppRoutes;
