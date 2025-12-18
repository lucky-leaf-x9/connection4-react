import { useEffect, useState } from "react";
import Board from "./Board";
import { Constants } from "../constants";
import PeerManager from "../game/PeerManager";
import minimax from "../game/Minimax";
import Connect4Game, { GameState } from "../game/Connect4Game";
import Nav from "./nav";
import { BoardType } from "../types";
import Loading from "./Loading";
import "./Game.scss";

interface GameProps {
    vsAi: boolean;
    connectingTo?: string;
}

/**
 * The game is stored outside of the component. Not sure how good this strategy is :(
 * Any user-interaction/rendering & ai triggering is done in component
 */

let game: Connect4Game | undefined;
let peerManager: PeerManager | undefined;

function Game({ vsAi, connectingTo }: GameProps) {
    // mama mia thats a lot of useStates
    const [board, setBoard] = useState<BoardType>(["", "", "", "", "", "", ""]);
    const [gameState, setGameState] = useState<GameState>(GameState.Active);
    const [canClick, setCanClick] = useState<boolean>(true);
    const [isOpponentTurn, setOpponentTurn] = useState<boolean>(false);
    const [connecting, setConnecting] = useState<boolean>(false);
    const [P2Pid, setP2Pid] = useState<string>("");
    const [playerNames, setPlayerNames] = useState({player1: localStorage.getItem("name") ?? "Player 1", player2: "Player 2"})

    // initiaialise game
    useEffect(() => {
        // initialise peer
        if (!vsAi) {
            setConnecting(true);
            peerManager = new PeerManager(playerNames.player1, connectingTo);
            peerManager.setOnConnectCallback(onPeerConnect);
            peerManager.setOnInitCallback(onP2PClientInit);
            peerManager.setOpponentMoveCallback(peerMove);

            window.history.replaceState(null, "", "/"); // remove id tag without refresh
        }

        game = new Connect4Game(peerManager);
        // make it not the players turn if they are connecting
        if (connectingTo) {
            game.isPlayerTurn = false;
            setCanClick(false);
        }
        setBoard(game.board);
    }, []);

    // Get the AI to play 1 second after
    useEffect(() => {
        if (!game) {
            console.error("GAME UNINITIALISED");
            return;
        }
        if (vsAi && isOpponentTurn && game.gameState === GameState.Active) {
            // calculate next move and execute it after 1s has passed
            const start = new Date();
            const aiColumn = minimax(game.board, 4, true, Constants.OPPONENT_SYMBOL)[0];

            if (aiColumn === null) {
                console.error("ERROR OCCURED");
                return;
            }
            const end = new Date();

            const delay = Math.max(0, 1000 - (end.getTime() - start.getTime()));
            setTimeout(() => {
                if (!game) return; // should never occur - shut up TS

                game.opponentMove(aiColumn);
                // manage useStates
                setBoard(game.board);
                setOpponentTurn(false);
                setGameState(game.gameState);
                if (game.gameState === GameState.Active) setCanClick(true);
            }, delay);
        }
    }, [isOpponentTurn]);

    function handlePlayerMove(column: number) {
        if (!game) {
            console.error("GAME UNINITIALISED");
            return;
        }
        game.playerMove(column);
        // manage useStates
        setBoard(game.board);
        setGameState(game.gameState);
        setCanClick(false);
        setOpponentTurn(true);
    }

    function handleRestart() {
        game = new Connect4Game(peerManager);
        setBoard(game.board);
        setGameState(game.gameState);
        setCanClick(true);
        setOpponentTurn(false);
    }
    const peerMove = (column: number) => {
        if (!game) return;
        game.opponentMove(column);
        // manage useStates
        setBoard(game.board);
        setOpponentTurn(false);
        setGameState(game.gameState);
        if (game.gameState === GameState.Active) setCanClick(true);
    };
    const onP2PClientInit = (id: string) => setP2Pid(id);
    const onPeerConnect = (peerName: string) => {
        setConnecting(false);
        setPlayerNames({...playerNames, player2: peerName})
    }
    if (connecting) {
        return (
            <>
                <Nav />
                <div className="waiting-container">
                    <Loading />
                    {connectingTo ? (
                        "Connecting..."
                    ) : (
                        <>
                            Waiting for opponent...
                            {P2Pid && (
                                <button
                                    className="button grey"
                                    style={{ margin: "1rem auto" }}
                                    onClick={() => navigator.clipboard.writeText(`${window.location.href}?id=${P2Pid}`)}
                                >
                                    Copy Link
                                </button>
                            )}
                        </>
                    )}
                </div>
            </>
        );
    }
    let statusText = "";
    switch (gameState) {
        case GameState.OpponentWin:
            statusText = "Game Over - Opponent wins!";
            break;
        case GameState.PlayerWin:
            statusText = "Game Over - You win!";
            break;
        case GameState.Draw:
            statusText = "Game Over - Draw";
            break;
        default:
            break;
    }
    return (
        <>
            <Nav />
            <div className="connect4">
                <div className="player-turns">
                    <div className={!isOpponentTurn ? "selected" : ""}>{playerNames.player1}</div>
                    <div className={isOpponentTurn ? "selected" : ""}>{playerNames.player2}</div>
                </div>
                {game ? <Board board={board} canClick={canClick} handlePlayerMove={handlePlayerMove} /> : ""}
                <div id="game-status">{statusText}</div>
                <button className="button green" style={{ display: `${gameState === GameState.Active ? "none" : ""}`, margin: "auto" }} onClick={handleRestart}>
                    Restart?
                </button>
            </div>
        </>
    );
}

export default Game;
