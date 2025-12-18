import { Constants } from "../constants";
import Connect4Game from "./Connect4Game";

const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;

const isColumnFull = (columnString: string) => columnString.length >= 6;

const isTerminalState = (board: string[]) => board.every((col) => isColumnFull(col)) || Connect4Game.isGameOver(board);

const getOppositeSymbol = (symbol: string) => (symbol === Constants.PLAYER_SYMBOL ? Constants.OPPONENT_SYMBOL : Constants.PLAYER_SYMBOL);

const evaluateBoard = (board: string[], symbol: string) => {
    const dirs = [
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
    ];
    // score for the number of pieces along a 4
    const rewards = [0, 1, 3, 5, 100];
    let goodValue = 0;
    let badValue = 0;
    
    for (let i = 0; i < BOARD_WIDTH; i++) {
        for (let j = 0; j < BOARD_HEIGHT; j++) {
            for (const [x, y] of dirs) {
                let symbols = 0;
                let badSymbols = 0;
                let k = 0;

                while (i + k * x < BOARD_WIDTH && j + k * y < BOARD_HEIGHT && j + k * y >= 0 && k < 4) {
                    if (j + k * y < board[i + k * x].length) {
                        if (board[i + k * x][j + k * y] === symbol) symbols++;
                        else badSymbols++;
                    }
                    k++;
                }

                goodValue += rewards[symbols];
                badValue += rewards[badSymbols];
            }
        }
    }

    return goodValue - badValue;
};

function minimax(board: string[], depth: number, maximizingPlayer: boolean, symbol: string): [number | null, number] {
    if (depth === 0 || isTerminalState(board)) {
        return [null, evaluateBoard(board, symbol)];
    }

    if (maximizingPlayer) {
        let maxScore = -Infinity;
        let bestCol = null;
        for (let col = 0; col < BOARD_WIDTH; col++) {
            if (!isColumnFull(board[col])) {
                const newBoard = [...board];
                newBoard[col] += symbol;
                const score = minimax(newBoard, depth - 1, false, symbol)[1];
                if (score > maxScore) {
                    maxScore = score;
                    bestCol = col;
                }
            }
        }
        return [bestCol, maxScore];
    } else {
        let minScore = Infinity;
        let bestCol = null;
        for (let col = 0; col < BOARD_WIDTH; col++) {
            if (!isColumnFull(board[col])) {
                const newBoard = [...board];
                newBoard[col] += getOppositeSymbol(symbol);
                const score = minimax(newBoard, depth - 1, true, symbol)[1];
                if (score < minScore) {
                    minScore = score;
                    bestCol = col;
                }
            }
        }
        return [bestCol, minScore];
    }
}

export default minimax;
