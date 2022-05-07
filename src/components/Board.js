import React, { useState } from 'react'
import Cell from './Cell'

const BOARDLENGTH = 10
const BOARDHEIGHT = 10

// return indices of bombs
const generateBombIndices = (numberOfBombs) => {
}

const newGame = () => {
    console.log("new game")
}

const Board = () => {

    const [board, setBoard] = useState(
        new Array(BOARDHEIGHT).fill(0).map(row => new Array(BOARDLENGTH).fill(0))
    )
    
  return (
      <>
        <div className='board'>
            {board.map((row, rowIndex) => 
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => 
                        <Cell key={colIndex} />
                    )}
                </div>
            )}
        </div>
        <button className="button" onClick={newGame}>NEW GAME</button>
      </>
  )
}

export default Board