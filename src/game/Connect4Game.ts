import { Constants } from "../constants";
import { BoardType } from "../types";
import PeerManager from "./PeerManager";

export const BOARD_WIDTH = 7;
export const BOARD_HEIGHT = 6;
export enum GameState {
    Active = 0,
    PlayerWin = 1,
    OpponentWin = 2,
    Draw = 3,
}

class Connect4Game {
    /** 
     * board array will look like:
     * [
            "XO",
            "X",
            "X",
            "O",
            "",
            "",
            "O"
        ]
    */
    board: BoardType;
    isPlayerTurn: boolean;
    peerManager: PeerManager | undefined;
    gameState: GameState;

    constructor(peerManager: PeerManager | undefined) {
        this.board = ['','','','','','',''];
        this.isPlayerTurn = true;
        if (peerManager) {
            this.peerManager = peerManager;
            this.peerManager.setOpponentMoveCallback(this.opponentMove);
        }
        this.gameState = GameState.Active;
    }

    playerMove(column: number) {
        if (!this.isPlayerTurn || this.board[column].length >= BOARD_HEIGHT) return;

        this.board[column] += Constants.PLAYER_SYMBOL;
        this.isPlayerTurn = false;

        // send data
        if (this.peerManager) {
            this.peerManager.sendMoveData(column);
        }
        this.gameState = Connect4Game.isGameOver(this.board)
    }

    opponentMove(column: number) {
        if (this.isPlayerTurn) {
            console.log("opponent made move out of turn?");
        }
        if (this.board[column].length >= BOARD_HEIGHT) return;

        this.board[column] += Constants.OPPONENT_SYMBOL;
        this.isPlayerTurn = true;
        this.gameState = Connect4Game.isGameOver(this.board)
    }
    static isGameOver = (board: string[]) => {
        const dirs = [
            [0, 1],
            [1, 1],
            [1, 0],
            [1, -1],
        ];
        //printBoard(board);
        for (let i = 0; i < BOARD_WIDTH; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const symb = board[i][j];

                for (const [x, y] of dirs) {
                    let k = 1;
                    while (i + k * x < 7 && j + k * y < board[i + k * x].length && j + k * y >= 0 && board[i + k * x][j + k * y] === symb) {
                        k += 1;
                        if (k === 4) {
                            return symb === Constants.PLAYER_SYMBOL ? GameState.PlayerWin : GameState.OpponentWin;
                        }
                    }
                }
            }
        }

        if (board.every((col) => col.length === 6)) {
            return GameState.Draw;
        }

        return GameState.Active;
    };

    private printBoard(board: string[]) {
        let boardStr = "";
        for (let row = 5; row >= 0; row--) {
            for (let col = 0; col < 7; col++) {
                if (board[col].length > row) {
                    boardStr += board[col][row] + " ";
                } else {
                    boardStr += "/ ";
                }
            }
            boardStr += "\n";
        }
        console.log(boardStr);
    }
}

export default Connect4Game;
