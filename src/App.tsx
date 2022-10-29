import { useEffect, useState } from "react"
import Board, { Row, CellData } from "./Board"
import Controls from "./Controls"
import { ROWS, COLUMNS, SQUARES_ARRAY } from "./constants"

// copying:
// https://sudoku.com/
// more blanks, more easy

const found = (board: Row[], num: number, row: number, column: number) => {
  // check the horizontal row for duplicates
  // finally, check the "square" 3x3 of the given row and column

  for (let i = 0; i < COLUMNS; ++i) {
    if (board[i]?.[column]?.value === num) {
      return true
    }
  }

  // check the vertical column for duplicates
  for (let i = 0; i < ROWS; ++i) {
    if (board[row]?.[i]?.value === num) {
      return true
    }
  }
  const { start, end }: any = SQUARES_ARRAY.find(
    (square) =>
      row >= square.start.row &&
      row <= square.end.row &&
      column >= square.start.column &&
      column <= square.end.column
  )

  for (let i = start.row; i <= end.row; ++i) {
    for (let j = start.column; j <= end.column; ++j) {
      if (board[i]?.[j]?.value === num) {
        return true
      }
    }
  }

  return false
}

const testBoard = [
  [4, 3, 5, 2, 6, 9, 7, 8, undefined], // answer 1
  [6, 8, 2, undefined, 7, 1, 4, 9, 3], // answer 5
  [1, 9, 7, 8, 3, 4, 5, 6, 2],
  [8, 2, 6, 1, 9, 5, 3, 4, 7],
  [3, 7, 4, 6, 8, 2, 9, 1, 5],
  [9, 5, 1, 7, 4, 3, 6, 2, 8],
  [5, 1, 9, 3, 2, 6, 8, 7, 4],
  [2, 4, 8, 9, 5, 7, 1, 3, 6],
  [7, 6, 3, 4, 1, 8, 2, 5, 9],
]

const getRandomBoard = () => {
  const board: Row[] = [[]]
  let numBlanks = 0
  for (let i = 0; i < ROWS; ++i) {
    if (!board[i]) {
      board[i] = []
    }
    for (let j = 0; j < COLUMNS; ++j) {
      // FIXME: fix game number generation logic
      // const randNum = Math.floor(Math.random() * 9) + 1
      // const value = !found(board, randNum, i, j) ? randNum : undefined
      const value = testBoard[i][j]
      if (value === undefined) {
        numBlanks += 1
      }
      board[i][j] = {
        value,
        id: { row: i, column: j },
        config: value !== undefined,
      }
    }
  }
  return { board, numBlanks }
}

function App() {
  const [board, setBoard] = useState<Row[]>([[]])
  const [reset, setReset] = useState(true)
  const [numBlanks, setNumBlanks] = useState(0)
  const [activeCell, setActiveCell] = useState<CellData>()
  const onNumberClick = (value: number) => {
    const nextBoard = board.slice()
    if (activeCell?.id && !activeCell?.config) {
      const valid = !found(
        board,
        value,
        activeCell.id.row,
        activeCell.id.column
      )
      nextBoard[activeCell.id.row][activeCell.id.column].valid = valid
      if (valid) {
        setNumBlanks(numBlanks - 1)
      }
      nextBoard[activeCell.id.row][activeCell.id.column].value = value
      setBoard(nextBoard)
    }
  }

  const onRestart = () => {
    localStorage.removeItem("sudoku_game_board")
    setReset(true)
  }
  const onCellClick = (id: CellData["id"], config: boolean, value?: number) => {
    setActiveCell({ id, config, value })
  }

  useEffect(() => {
    // live board, not initial state
    if (board[0][0]) {
      localStorage.setItem("sudoku_game_board", JSON.stringify(board))
      localStorage.setItem(
        "sudoku_game_board_blanks",
        JSON.stringify(numBlanks)
      )
    }
  }, [board, numBlanks])

  useEffect(() => {
    const gameBoard =
      localStorage.getItem("sudoku_game_board") &&
      JSON.parse(localStorage.getItem("sudoku_game_board") as string)
    if (reset && !gameBoard) {
      const { board: nextGameBoard, numBlanks } = getRandomBoard()
      localStorage.setItem("sudoku_game_board", JSON.stringify(nextGameBoard))
      localStorage.setItem(
        "sudoku_game_board_blanks",
        JSON.stringify(numBlanks)
      )
      setBoard(nextGameBoard)
      setNumBlanks(numBlanks)
      setReset(false)
    }
    if (reset && gameBoard) {
      setBoard(gameBoard)
      setNumBlanks(
        JSON.parse(
          localStorage.getItem("sudoku_game_board_blanks") as string
        ) as number
      )
      setReset(false)
    }
  }, [reset])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.code.match(/Digit[1-9]/) &&
        activeCell?.id &&
        !activeCell?.config
      ) {
        const nextBoard = board.slice()
        const value = parseInt(event.key)
        const valid = !found(
          board,
          value,
          activeCell.id.row,
          activeCell.id.column
        )

        nextBoard[activeCell.id.row][activeCell.id.column].valid = valid
        nextBoard[activeCell.id.row][activeCell.id.column].value = value
        if (valid) {
          setNumBlanks(numBlanks - 1)
        }
        setBoard(nextBoard)
      }
    }
    document.addEventListener("keydown", onKeyDown)

    return () => document.removeEventListener("keydown", onKeyDown)
  }, [board, activeCell, numBlanks])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <main style={{ display: "flex", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ width: "100%", textAlign: "center" }}>React Sudoku</h1>
          {numBlanks > 0 ? `Blanks remaining: ${numBlanks}` : "You won!"}
          {numBlanks > 0 && (
            <Board
              activeCell={activeCell as CellData}
              onClick={onCellClick}
              board={board}
            />
          )}
        </div>
        <div style={{ padding: "2em" }}>
          <Controls onClick={onNumberClick} onRestart={onRestart} />
        </div>
      </main>
    </div>
  )
}

export default App
