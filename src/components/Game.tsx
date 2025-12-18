import { useEffect, useRef, useState } from "react";
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

function Game({ vsAi, connectingTo }: GameProps) {
    // mama mia thats a lot of useStates
    const [board, setBoard] = useState<BoardType>(["", "", "", "", "", "", ""]);
    const [gameState, setGameState] = useState<GameState>(GameState.Active);
    const [canClick, setCanClick] = useState<boolean>(true);
    const [isOpponentTurn, setOpponentTurn] = useState<boolean>(false);
    const [connecting, setConnecting] = useState<boolean>(false);
    const [P2Pid, setP2Pid] = useState<string>("");
    const [playerNames, setPlayerNames] = useState({ player1: localStorage.getItem("name") ?? "Player 1", player2: vsAi ? "AI" : "Player 2" });
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    // refs for preserving value between renders
    const gameRef = useRef<Connect4Game | undefined>(undefined);
    const p2pRef = useRef<PeerManager | undefined>(undefined);

    // initiaialise game
    useEffect(() => {
        // initialise peer
        if (!vsAi) {
            setConnecting(true);
            p2pRef.current = new PeerManager(playerNames.player1, connectingTo);
            p2pRef.current.setOnConnectCallback(onPeerConnect);
            p2pRef.current.setOnInitCallback(onP2PClientInit);
            p2pRef.current.setOpponentMoveCallback(peerMove);
            p2pRef.current.setErrorCallback(onP2PError);

            // remove ID tag without refresh
            const url = new URL(window.location.href);
            url.search = "";
            window.history.replaceState(null, "", url.toString());
        }

        gameRef.current = new Connect4Game(p2pRef.current);
        // make it not the players turn if they are connecting
        if (connectingTo) {
            gameRef.current.isPlayerTurn = false;
            setCanClick(false);
        }
        setBoard(gameRef.current.board);
    }, []);

    // Get the AI to play 1 second after
    useEffect(() => {
        if (!gameRef.current) {
            console.error("GAME UNINITIALISED");
            return;
        }
        if (vsAi && isOpponentTurn && gameRef.current.gameState === GameState.Active) {
            // calculate next move and execute it after 1s has passed
            const start = new Date();
            const aiColumn = minimax(gameRef.current.board, 4, true, Constants.OPPONENT_SYMBOL)[0];

            if (aiColumn === null) {
                console.error("ERROR OCCURED");
                return;
            }
            const end = new Date();

            const delay = Math.max(0, 1000 - (end.getTime() - start.getTime()));
            setTimeout(() => {
                if (!gameRef.current) return; // should never occur - shut up TS

                gameRef.current.opponentMove(aiColumn);
                // manage useStates
                setBoard(gameRef.current.board);
                setOpponentTurn(false);
                setGameState(gameRef.current.gameState);
                if (gameRef.current.gameState === GameState.Active) setCanClick(true);
            }, delay);
        }
    }, [isOpponentTurn]);

    function handlePlayerMove(column: number) {
        if (!gameRef.current) {
            console.error("GAME UNINITIALISED");
            return;
        }
        gameRef.current.playerMove(column);
        // manage useStates
        setBoard(gameRef.current.board);
        setGameState(gameRef.current.gameState);
        setCanClick(false);
        setOpponentTurn(true);
    }

    function handleRestart() {
        gameRef.current = new Connect4Game(p2pRef.current);
        setBoard(gameRef.current.board);
        setGameState(gameRef.current.gameState);
        setCanClick(true);
        setOpponentTurn(false);
    }
    const peerMove = (column: number) => {
        if (!gameRef.current) return;
        gameRef.current.opponentMove(column);
        // manage useStates
        setBoard(gameRef.current.board);
        setOpponentTurn(false);
        setGameState(gameRef.current.gameState);
        if (gameRef.current.gameState === GameState.Active) setCanClick(true);
    };
    const onP2PClientInit = (id: string) => setP2Pid(id);

    const onPeerConnect = (peerName: string) => {
        setConnecting(false);
        // indicate that its opponents turn if connecting
        if (connectingTo) setOpponentTurn(true);
        setPlayerNames({ ...playerNames, player2: peerName });
    };

    const onP2PError = (message: string) => {
        setErrorMessage(message);
    };

    if (errorMessage) {
        return (
            <>
                <Nav />
                <div className="error-container">
                    <div className="error-icon">⚠</div>
                    {errorMessage}
                </div>
            </>
        );
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
                {gameRef.current ? <Board board={board} canClick={canClick} handlePlayerMove={handlePlayerMove} /> : ""}
                <div id="game-status">{statusText}</div>
                <button className="button green" style={{ display: `${gameState === GameState.Active ? "none" : ""}`, margin: "auto" }} onClick={handleRestart}>
                    Restart?
                </button>
            </div>
        </>
    );
}

export default Game;
