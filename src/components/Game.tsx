import { useEffect, useState } from "react";
import Board from "./Board";
import { Constants } from "../constants";
import PeerManager from "../game/PeerManager";
import minimax from "../game/Minimax";
import Connect4Game, { GameState } from "../game/Connect4Game";
import Nav from "./nav";
import { BoardType } from "../types";

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
    const [board, setBoard] = useState<BoardType>(["", "", "", "", "", "", ""]);
    const [gameState, setGameState] = useState<GameState>(GameState.Active);
    const [canClick, setCanClick] = useState<boolean>(true);
    const [isAITurn, setAITurn] = useState<boolean>(false);

    // initiaialise game
    useEffect(() => {
        if (!vsAi) peerManager = new PeerManager("wow", connectingTo);
        game = new Connect4Game(peerManager);
        setBoard(game.board);
    }, []);

    // Get the AI to play 1 second after
    useEffect(() => {
        if (!game) {
            console.log("GAME UNINITIALISED");
            return;
        }
        if (vsAi && isAITurn && game.gameState === GameState.Active) {
            // calculate next move and execute it after 1s has passed
            const start = new Date();
            const aiColumn = minimax(game.board, 4, true, Constants.OPPONENT_SYMBOL)[0];

            if (aiColumn === null) {
                console.log("ERROR OCCURED");
                return;
            }
            const end = new Date();

            const delay = Math.max(0, 1000 - (end.getTime() - start.getTime()));
            setTimeout(() => {
                if (!game) return; // should never occur - shut up TS

                game.opponentMove(aiColumn);
                // manage useStates
                setBoard(game.board);
                setAITurn(false);
                setGameState(game.gameState);
                if (game.gameState === GameState.Active) setCanClick(true);
            }, delay);
        }
    }, [isAITurn]);

    function handlePlayerMove(column: number) {
        if (!game) {
            console.log("GAME UNINITIALISED");
            return;
        }
        game.playerMove(column);
        // manage useStates
        setBoard(game.board);
        setGameState(game.gameState);
        setCanClick(false);
        setAITurn(true);
    }

    function handleRestart() {
        game = new Connect4Game(peerManager);
        setBoard(game.board);
        setGameState(game.gameState);
        setCanClick(true);
        setAITurn(false);
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
                    <div id="player1">Player 1</div>
                    <div id="player2">Player 2</div>
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
