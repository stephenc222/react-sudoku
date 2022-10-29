import React from "react"

const Controls = ({ onClick, onRestart }: any) => {
  return (
    <div>
      <div>
        <button onClick={onRestart}>New Game</button>
      </div>
      <div>
        <div>
          <button onClick={() => onClick(1)}>1</button>
          <button onClick={() => onClick(2)}>2</button>
          <button onClick={() => onClick(3)}>3</button>
        </div>
        <div>
          <button onClick={() => onClick(4)}>4</button>
          <button onClick={() => onClick(5)}>5</button>
          <button onClick={() => onClick(6)}>6</button>
        </div>
        <div>
          <button onClick={() => onClick(7)}>7</button>
          <button onClick={() => onClick(8)}>8</button>
          <button onClick={() => onClick(9)}>9</button>
        </div>
      </div>
    </div>
  )
}

export default Controls
