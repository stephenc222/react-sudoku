import React from "react"

type ID = {
  row: number
  column: number
}

export type CellData = {
  value: number | undefined
  id: ID
  config: boolean
}

export type Row = CellData[]

const Cell = ({ value, onClick, active, sameRow, sameColumn }: any) => (
  <button
    onClick={onClick}
    style={{
      width: 50,
      height: 50,
      padding: "0.5em",
      border: "1px solid black",
      backgroundColor: active
        ? "skyblue"
        : sameRow || sameColumn
        ? "#daeff8"
        : "white",
    }}
  >
    {value}
  </button>
)

const Board = ({
  activeCell,
  board = [[]],
  onClick = () => {},
}: {
  activeCell: CellData
  board: Row[]
  onClick: (id: CellData["id"], config: boolean, value?: number) => void
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {board.map((row, index) => (
        <div style={{ display: "flex" }} key={`row_${index}`}>
          {row.map(({ config, id, value }) => (
            <Cell
              key={`${id.row}_$${id.column}`}
              value={value}
              sameRow={activeCell?.id?.row === id.row}
              sameColumn={activeCell?.id?.column === id.column}
              active={
                id.row === activeCell?.id?.row &&
                id.column === activeCell?.id?.column
              }
              onClick={() => onClick(id, config, value)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Board
