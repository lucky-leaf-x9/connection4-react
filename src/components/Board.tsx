import "./Board.scss";
import { Constants } from "../constants";
import { BoardType } from "../types";

interface BoardProps {
  board: BoardType;
  canClick: boolean;
  handlePlayerMove: (column: number) => void;
}

function Board({ board, canClick, handlePlayerMove }: BoardProps) {
  const renderColumns = () => {
    const columns = [];

    for (let col = 0; col < 7; col++) {
      columns.push(
        <div
          key={`c${col}`}
          className={`column ${board[col].length >= 6 ? "disabled" : ""}`}
          onClick={() => (canClick ? handlePlayerMove(col) : null)}
        >
          {[...Array(6)].map((_, row) => (
            <div key={row} className="slot">
              {board[col][5 - row] === Constants.PLAYER_SYMBOL && <div className="piece player" />}
              {board[col][5 - row] === Constants.OPPONENT_SYMBOL && <div className="piece opp" />}
            </div>
          ))}
        </div>
      );
    }

    return columns;
  };

  return <div className={`board ${canClick ? "" : "disabled"}`}>{renderColumns()}</div>;
}

export default Board;
