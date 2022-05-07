import React, { useState } from 'react'

const BOARDLENGTH = 10
const BOARDHEIGHT = 10


const generateBombIndices = (numberOfBombs) => {

}

const Board = () => {

    const [board, setBoard] = useState(
        new Array(BOARDHEIGHT).fill(0).map(row => new Array(BOARDLENGTH).fill(0))
    )
    
  return (
      <>
        <div className='board'>
            {board.map((row, index1) => 
                <div key={index1} className="row">
                    {row.map((cell, index2) => 
                        (<div key={index2} className="cell"></div>)
                    )}
                </div>
            )}
        </div>
      </>
  )
}

export default Board