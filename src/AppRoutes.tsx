import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";
import { useEffect } from "react";

function AppRoutes() {
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const id = queryParameters.get("id");

    useEffect(() => {
        //if (id) {
            navigate("/game");
        //}
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game vsAi={true} connectingTo={id} />} />
        </Routes>
    );
}

export default AppRoutes;
