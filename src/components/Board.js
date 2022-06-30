import React, { useEffect, useState } from 'react'
import newBoard from '../utils/newBoard'

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

    const [mobileVersion, setToMobile] = useState(false)
    const [darkTheme, setTheme] = useState(true)
    const [flagButton, setFlagButton] = useState(false)

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
        if (BOARDHEIGHT == 1 && BOARDLENGTH == 1) {
            let newNumBombs = Math.round(Math.random())
            newestBoard = newBoard(BOARDLENGTH, BOARDHEIGHT, newNumBombs);
            setNumBombs(newNumBombs);
        }
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
                if (boardCopy[i][j].isBomb && boardCopy[i][j].flagged === false) {
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
                            if (i == a && j == b) {
                                continue;
                            } else {
                                return;
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
        if (board[i][j].flagged === false) {
            setNumFlagged(numFlagged + 1)
        } else {
            setNumFlagged(numFlagged - 1)
        }
        let boardCopy = JSON.parse(JSON.stringify(board))
        boardCopy[i][j].flagged = !boardCopy[i][j].flagged
        setBoard(boardCopy)
    }

    if (board === [[]]) {
        return (<div>Loading...</div>)
    } else {
        return (
            <div className="App">
            <header className="App-header">
            <p></p>
            <div className="title">{(gameOver ? (gameWon ? "YOU WIN!" : "GAME OVER :P") : "MINESWEEPER")}</div>
                <div className='board'>
                    {board.map((row, rowIndex) => {
                        if ((rowIndex) > 0 && rowIndex < BOARDHEIGHT + 1) {
                        return (<div key={rowIndex} className="row">
                            {row.map((cell, colIndex) => {
                                if ((colIndex) > 0 && colIndex < BOARDLENGTH + 1) {
                                return (<div className={`cell ${board[rowIndex][colIndex].value}-${board[rowIndex][colIndex].hidden} 
                                                            ${(board[rowIndex][colIndex].hidden) ? "hidden" : "revealed"}
                                                            ${(board[rowIndex][colIndex].flagged) ? "flagged" : "unflagged"}
                                                            ${(darkTheme) ? "dark" : "light"}
                                                            ${(gameOver) ? "gameover" : ""}`}
                                            id={rowIndex + "," + colIndex}
                                            key={colIndex}
                                            onClick={(flagButton === true) ? 
                                                (e) => toggleFlag(e, rowIndex, colIndex) : 
                                                () => revealCell(rowIndex, colIndex)}
                                            onContextMenu = {(e) => toggleFlag(e, rowIndex, colIndex)}
                                            onDoubleClick = {(e) => toggleFlag(e, rowIndex, colIndex)}>
                                    {(board[rowIndex][colIndex].hidden === true) ? 
                                        ((board[rowIndex][colIndex].flagged === true) ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag-fill" viewBox="0 0 16 16">
                                                <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                                        </svg> : 
                                            "") :
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
                    {/* <button className="flagged cell hidden dark flagButton"
                        onClick = {() => setFlagButton(!flagButton)}>F</button> */}
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
                <div style={{display:'flex', alignItems:'center', justifyContent:"center"}}>
                    <button className="button" onClick={() => {
                        setBoardHeight(16); setBoardLength(30); setNumBombs(50)
                    }}>RELAXED</button>
                    <button className="button" onClick={() => {
                        setBoardHeight(Math.floor(1)); 
                        setBoardLength(Math.floor(1)); 
                        setNumBombs(Math.round(Math.random()))
                    }}>ROULETTE</button>
                </div>
                <div className='footer'></div>
            </header>
            </div>
  )
}}

export default Board