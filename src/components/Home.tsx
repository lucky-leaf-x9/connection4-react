import { ChangeEvent, useState } from "react";
import "./Home.scss";

function Home() {
    const [name, setName] = useState("");

    function manageNameInput(event: ChangeEvent<HTMLInputElement>) {
        const newName = event.target.value;
        setName(newName);
        console.log(newName);
    }

    return (
        <div id="title-card">
            <div style={{ margin: "1rem", fontSize: "1.2rem" }}>Your Name:</div>
            <input value={name} type="text" placeholder="Enter your name" style={{ display: "block", margin: "auto" }} onChange={manageNameInput} />
            <div id="connect-buttons" className={name ? "" : "disabled"}>
                <button className="button green" id="play-friend" disabled={isEmpty(name)}>
                    Play with a friend
                </button>
                <button className="button green" id="play-ai" disabled={isEmpty(name)}>
                    Play against AI
                </button>
            </div>
        </div>
    );
}

const isEmpty = (str: string) => !str.trim();

export default Home;
