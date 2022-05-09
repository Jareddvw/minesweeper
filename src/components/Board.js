import React, { useEffect, useState } from 'react'
import Cell from './Cell'
import newBoard from './newBoard'

const Board = () => {

    const [board, setBoard] = useState(
        [[]]
    )

    const [BOARDHEIGHT, setBoardHeight] = useState(9)
    const [BOARDLENGTH, setBoardLength] = useState(9)
    const [NUMBOMBS, setNumBombs] = useState(10)

    useEffect(() => {
        resetBoard()
    }, [BOARDHEIGHT, BOARDLENGTH, NUMBOMBS])

    const resetBoard = () => {
        let newestBoard = newBoard(BOARDLENGTH, BOARDHEIGHT, NUMBOMBS);
        setBoard(newestBoard)
    }

    const revealAll = () => {
        let boardCopy = JSON.parse(JSON.stringify(board))
        for (let i=1; i < BOARDHEIGHT + 1; i += 1) {
            for (let j=1; j < BOARDLENGTH + 1; j += 1) {
                boardCopy[i][j].hidden = false
            }
        }
        setBoard(boardCopy)
    }

    const revealCell = (rowIndex, colIndex) => {
        if (board[rowIndex][colIndex].hidden === false) {
            return;
        } else if (board[rowIndex][colIndex].flagged === true) {
            return;
        }
        let boardCopy = JSON.parse(JSON.stringify(board))
        boardCopy[rowIndex][colIndex].hidden = false
        setBoard(boardCopy)
        if (board[rowIndex][colIndex].isBomb) {
            console.log("game over (you lost)")
        }
        if (board[rowIndex][colIndex].value === 0) {
            for (let yrange = rowIndex - 1; yrange < rowIndex + 2; yrange += 1) {
                for (let xrange = colIndex - 1; xrange < colIndex + 2; xrange += 1) {
                    if (xrange === 0 || xrange === BOARDLENGTH + 1 ||
                        yrange === 0 || yrange === BOARDHEIGHT + 1) {
                        continue
                    } else {
                        setTimeout(() => {
                            if (document.getElementById(`${yrange},${xrange}`)) {
                                document.getElementById(`${yrange},${xrange}`).click();
                                console.log(document.getElementById(`${yrange},${xrange}`))
                            }
                        }, 0)
                    }
                }
            }
        }
    }

    const toggleFlag = (e, i, j) => {
        e.preventDefault()
        let boardCopy = JSON.parse(JSON.stringify(board))
        boardCopy[i][j].flagged = !boardCopy[i][j].flagged
        setBoard(boardCopy)
    }

    if (board === [[]]) {
        return (<div>Loading...</div>)
    } else {
        return (
            <>
                <div className='board'>
                    {board.map((row, rowIndex) => {
                        if ((rowIndex) > 0 && rowIndex < BOARDHEIGHT + 1) {
                        return (<div key={rowIndex} className="row">
                            {row.map((cell, colIndex) => {
                                if ((colIndex) > 0 && colIndex < BOARDLENGTH + 1) {
                                return (<div className={`cell ${board[rowIndex][colIndex].value}-${board[rowIndex][colIndex].hidden} 
                                                            ${(board[rowIndex][colIndex].hidden) ? "hidden" : "revealed"}
                                                            ${(board[rowIndex][colIndex].flagged) ? "flagged" : "unflagged"}`}
                                            id={rowIndex + "," + colIndex}
                                            key={colIndex}
                                            onClick={() => revealCell(rowIndex, colIndex)}
                                            onContextMenu = {(e) => toggleFlag(e, rowIndex, colIndex)}>
                                    {(board[rowIndex][colIndex].hidden === true) ? 
                                        ((board[rowIndex][colIndex].flagged === true) ?
                                            "F" : "") :
                                            (board[rowIndex][colIndex].value === 0 ?
                                                "" : board[rowIndex][colIndex].value)}
                                    </div>)
                                }
                            }
                            )}
                        </div>)}
                    }
                    )}
                </div>
                <button className="button" onClick={resetBoard}>NEW GAME</button>
                {/* <button className="button" onClick={revealAll}>REVEAL ALL</button> */}
                <div style={{display:'flex', alignItems:'center', justifyContent:"center"}}>
                <button className="button" onClick={() => {
                    setBoardHeight(9); setBoardLength(9); setNumBombs(10)
                }}>BEGINNER</button>
                <button className="button" onClick={() => {
                    setBoardHeight(16); setBoardLength(16); setNumBombs(40)
                }}>INTERMEDIATE</button>
                <button className="button" onClick={() => {
                    setBoardHeight(16); setBoardLength(30); setNumBombs(99)
                }}>EXPERT</button>
                </div>
            </>
  )
}}

export default Board