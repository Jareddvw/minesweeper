import React, { useEffect, useState } from 'react'
import newBoard from './newBoard'

// All the game logic is handled here, other than creating the initial board.
const Board = () => {

    const [board, setBoard] = useState(
        [[]]
    )

    const [BOARDHEIGHT, setBoardHeight] = useState(9)
    const [BOARDLENGTH, setBoardLength] = useState(9)
    const [NUMBOMBS, setNumBombs] = useState(10)
    const [gameOver, setGameOver] = useState(false)
    const [numFlagged, setNumFlagged] = useState(0)
    const [gameWon, setGameWon] = useState(false)

    useEffect(() => {
        resetBoard()
    }, [BOARDHEIGHT, BOARDLENGTH, NUMBOMBS])

    useEffect(() => {
        if (numFlagged === NUMBOMBS) {
            checkGameWon()
        }
    }, [numFlagged])

    const resetBoard = () => {
        let newestBoard = newBoard(BOARDLENGTH, BOARDHEIGHT, NUMBOMBS);
        setGameOver(false)
        setGameWon(false)
        setNumFlagged(0)
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
        setGameOver(true)
    }

    const showAllBombs = () => {
        let boardCopy = JSON.parse(JSON.stringify(board))
        for (let i=1; i < BOARDHEIGHT + 1; i += 1) {
            for (let j=1; j < BOARDLENGTH + 1; j += 1) {
                if (boardCopy[i][j].isBomb) {
                    boardCopy[i][j].hidden = false
                }
            }
        }
        setBoard(boardCopy)
        setGameOver(true)
    }

    const revealCell = (rowIndex, colIndex) => {
        if (gameOver) {
            return;
        }
        if (board[rowIndex][colIndex].hidden === false) {
            return;
        } else if (board[rowIndex][colIndex].flagged === true) {
            return;
        }
        let boardCopy = JSON.parse(JSON.stringify(board))
        boardCopy[rowIndex][colIndex].hidden = false
        setBoard(boardCopy)
        if (board[rowIndex][colIndex].isBomb) {
            showAllBombs()
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
                            }
                        }, 0)
                    }
                }
            }
        }
        if (numFlagged === NUMBOMBS) {
            checkGameWon(rowIndex, colIndex)
        }
    }

    const checkGameWon = (a, b) => {
        for (let i=1; i < BOARDHEIGHT + 1; i += 1) {
            for (let j=1; j < BOARDLENGTH + 1; j += 1) {
                if (board[i][j].hidden === true && 
                    board[i][j].flagged === false && 
                    !board[i][j].isBomb) {
                        if (a && b) {
                            if (i == 1 && j == b) {
                                continue
                            }
                        } else {
                            return;
                        }
                } else if (board[i][j].flagged === true && !board[i][j].isBomb) {
                    return;
                }
            }
        }
        setGameWon(true)
        setGameOver(true)
    }

    const toggleFlag = (e, i, j) => {
        e.preventDefault()
        if (gameOver) {
            return
        }
        let boardCopy = JSON.parse(JSON.stringify(board))
        boardCopy[i][j].flagged = !boardCopy[i][j].flagged
        setBoard(boardCopy)
        if (boardCopy[i][j].flagged === true) {
            setNumFlagged(numFlagged + 1)
        } else {
            setNumFlagged(numFlagged - 1)
        }
    }

    if (board === [[]]) {
        return (<div>Loading...</div>)
    } else {
        return (
            <>
            <p></p>
            <div className="title">{(gameOver ? (gameWon ? "You win!" : "Game over :P") : "MINESWEEPER")}</div>
                <div className='board'>
                    {board.map((row, rowIndex) => {
                        if ((rowIndex) > 0 && rowIndex < BOARDHEIGHT + 1) {
                        return (<div key={rowIndex} className="row">
                            {row.map((cell, colIndex) => {
                                if ((colIndex) > 0 && colIndex < BOARDLENGTH + 1) {
                                return (<div className={`cell ${board[rowIndex][colIndex].value}-${board[rowIndex][colIndex].hidden} 
                                                            ${(board[rowIndex][colIndex].hidden) ? "hidden" : "revealed"}
                                                            ${(board[rowIndex][colIndex].flagged) ? "flagged" : "unflagged"}
                                                            ${(gameOver) ? "gameover" : ""}`}
                                            id={rowIndex + "," + colIndex}
                                            key={colIndex}
                                            onClick={() => revealCell(rowIndex, colIndex)}
                                            onContextMenu = {(e) => toggleFlag(e, rowIndex, colIndex)}
                                            onDoubleClick = {(e) => toggleFlag(e, rowIndex, colIndex)}>
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
                <div style={{display:'flex', alignItems:'center', justifyContent:"center"}}>
                    <button className="button" onClick={resetBoard}>NEW GAME</button>
                    {/* <button className="button" onClick={revealAll}>REVEAL ALL</button>
                    <button className="button" onClick={showAllBombs}>SHOW BOMBS</button> */}
                </div>
                <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center'}}>
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
                <div className='footer'></div>
            </>
  )
}}

export default Board