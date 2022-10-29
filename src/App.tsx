import { useEffect, useState } from "react"
import Board, { Row, CellData } from "./Board"
import Controls from "./Controls"

const ROWS = 9
const COLUMNS = 9

// copying:
// https://sudoku.com/
// more blanks, more easy
// TODO: "set" this
const DIFFICULTY = 2

const getRandomBoard = () => {
  const board: Row[] = [[]]
  for (let i = 0; i < ROWS; ++i) {
    if (!board[i]) {
      board[i] = []
    }
    for (let j = 0; j < COLUMNS; ++j) {
      const randNum = Math.floor(Math.random() * 9)
      const isBlank = randNum % DIFFICULTY === 0
      board[i][j] = {
        value: isBlank ? randNum : undefined,
        id: { row: i, column: j },
        config: isBlank,
      }
    }
  }
  return board
}

function App() {
  const [board, setBoard] = useState<Row[]>([[]])
  const [reset, setReset] = useState(true)
  const [activeCell, setActiveCell] = useState<CellData>()
  const onNumberClick = (value: number) => {
    const nextBoard = board.slice()
    if (activeCell?.id && !activeCell?.config) {
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
    }
  }, [board])

  useEffect(() => {
    const gameBoard =
      localStorage.getItem("sudoku_game_board") &&
      JSON.parse(localStorage.getItem("sudoku_game_board") as string)
    if (reset && !gameBoard) {
      const nextGameBoard = getRandomBoard()
      localStorage.setItem("sudoku_game_board", JSON.stringify(nextGameBoard))
      setBoard(nextGameBoard)
      setReset(false)
    }
    if (reset && gameBoard) {
      setBoard(gameBoard)
      setReset(false)
    }
  }, [reset])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.code.match(/Digit[0-9]/) &&
        activeCell?.id &&
        !activeCell?.config
      ) {
        const value = parseInt(event.key)
        const nextBoard = board.slice()
        nextBoard[activeCell.id.row][activeCell.id.column].value = value
        setBoard(nextBoard)
      }
    }
    document.addEventListener("keydown", onKeyDown)

    return () => document.removeEventListener("keydown", onKeyDown)
  }, [board, activeCell])

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
        <div>
          <h1 style={{ width: "100%", textAlign: "center" }}>React Sudoku</h1>
          <Board
            activeCell={activeCell as CellData}
            onClick={onCellClick}
            board={board}
          />
        </div>
        <div style={{ padding: "2em" }}>
          <Controls onClick={onNumberClick} onRestart={onRestart} />
        </div>
      </main>
    </div>
  )
}

export default App
