
// return an array of Cell objects 
const newBoard = ( width, height, numBombs ) => {

    let arr = new Array(height + 2)
    const bomb = "*"
    
    // filling array with default empty cells
    // array has dimensions (height + 2) x (width + 2)
    // so that there is a border of cells that don't show up around the central board.
    for (let i=0; i < height + 2; i += 1) {
      arr[i] = new Array(width + 2)
      for (let j=0; j < width + 2; j += 1) {
        let cell = {
          value:0,
          hidden:true,
          flagged:false,
        }
        cell.isBomb = (cell.value === bomb)
        arr[i][j] = cell
      }
    }

    // adding bombs to board
    // randomly added to indices in range i in [1, height + 1], j in [1, width + 1]
    let n = numBombs
    while (n > 0) {
      let i = Math.floor(Math.random() * height) + 1
      let j = Math.floor(Math.random() * width) + 1
      if (!arr[i][j].isBomb) {
        arr[i][j].value = bomb
        arr[i][j].isBomb = true
        n -= 1
      }
    }

    // setting numbers to neighbors of bombs
    // only need to check inner board of dimensions height x width 
    for (let i=1; i < height + 1; i += 1) {
      for (let j=1; j < width + 1; j += 1) {
        if (arr[i][j].isBomb) {
          for (let yrange = i - 1; yrange < i + 2; yrange += 1) {
            for (let xrange = j - 1; xrange < j + 2; xrange += 1) {
              if (yrange === i && xrange === j) {
                continue
              }
              if (!arr[yrange][xrange].isBomb) {
                arr[yrange][xrange].value += 1;
              }
            } 
          }
        }
      }
    }

  return (
    arr
  )
}

export default newBoard;