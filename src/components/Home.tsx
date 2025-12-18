import { ChangeEvent, useEffect, useState } from "react";
import "./Home.scss";
import { useNavigate } from "react-router-dom";

function Home() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    // load name on first render
    useEffect(() => {
        const storedName = localStorage.getItem("name");
        if (storedName) {
            setName(storedName);
        }
    }, []);

    function manageNameInput(event: ChangeEvent<HTMLInputElement>) {
        const newName = event.target.value;
        setName(newName);
        localStorage.setItem("name", newName);
    }

    return (
        <>
            <div id="title-card">
                <div style={{ margin: "1rem", fontSize: "1.2rem", fontWeight: "600" }}>Your Name:</div>
                <input value={name} type="text" placeholder="Enter your name" style={{ display: "block", margin: "auto" }} onChange={manageNameInput} />
                <div id="connect-buttons" className={name ? "" : "disabled"}>
                    <button className="button default" disabled={isEmpty(name)} onClick={() => navigate("/game/vs")}>
                        Play with a friend
                    </button>
                    <button className="button default" disabled={isEmpty(name)} onClick={() => navigate("/game/ai")}>
                        Play against AI
                    </button>
                </div>
            </div>
        </>
    );
}

const isEmpty = (str: string) => !str.trim();

export default Home;
