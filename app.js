function init() {

  const gameContainer = document.querySelector('#game_board_container')

  const gameStats = {
    boardWidth: 8,
    boardHeight: 8,
    squareSize: 30,
    mines: 10
  }

  const gameState = {
    firstClicked: false,
    mines: [],
    selected: []
  }

  const boardArray = []

  // ! BOARD CREATION FUNCTIONS

  function createSquare(i, j) {
    const square = document.createElement('div')
    square.classList.add('square')
    square.style.width = `${gameStats.squareSize}px`
    square.style.height = `${gameStats.squareSize}px`
    square.innerText = `${(i * gameStats.boardWidth) + j}`
    boardArray.push(square)

    gameContainer.appendChild(square)
  }

  function createBoard() {
    for (let i = 0; i < gameStats.boardWidth; i++) {
      for (let j = 0; j < gameStats.boardHeight; j++) {
        createSquare(i, j)
      }
    }
  }

  function adjustBoardSize() {
    gameContainer.style.width = `${gameStats.squareSize * gameStats.boardWidth}px`
  }

  // ! Create Mines

  function randomMineNumber() {
    return Math.floor(Math.random() * (gameStats.boardWidth * gameStats.boardHeight))
  }

  function createRandomMines(target) {
    for (let i = 0; i < gameStats.mines; i++) {
      let mine = randomMineNumber()
      while (
        gameState.mines.includes(mine) || 
        mine === target
      ) {
        mine = randomMineNumber()
      }
      gameState.mines.push(mine)
    }
    console.log(gameState.mines)
  }


  // ! Click/Mine Comparison

  function clickHit(targetIndex) {
    if (gameState.selected.includes(targetIndex)) return
    if (gameState.mines.includes(targetIndex)) {
      hitMine()
    } else {
      checkSquaresAround(targetIndex)
      // hitClear(targetIndex)
    }

  }

  function hitMine() {
    console.log('You\'ve Lost')
  }

  function hitClear(targetIndex) {
    console.log('you\'re clear')
    gameState.selected.push(targetIndex)
    addClearBackground(boardArray[targetIndex])

  }

  function addClearBackground(element) {
    console.log(element)
    element.classList.add('clicked')
  }

  // ! Check around recursivly 

  function checkSquaresAround(targetIndex) {

    // Check the element you are on
    // If it is a mine, return
    // if is not a mine, change the background and call self on above, below, right and left

    console.log('recursion', targetIndex)

    if (
      gameState.mines.includes(targetIndex) || 
      gameState.selected.includes(targetIndex)
    ) {
      return
    } else {
      hitClear(targetIndex)
      if (checkRight(targetIndex + 1)) checkSquaresAround(targetIndex + 1)
      if (checkLeft(targetIndex - 1)) checkSquaresAround(targetIndex - 1)
      if (botCheck(targetIndex + 10)) checkSquaresAround(targetIndex + 10)
      if (topCheck(targetIndex - 10)) checkSquaresAround(targetIndex - 10)
    }
  }

  // * Refactor these into one function

  function checkRight(indexCheck) {
    return (indexCheck + 1) % gameStats.width === 0 ? false : true 
  }

  function checkLeft(indexCheck) {
    return indexCheck % gameStats.width === 0 ? false : true 
  }
  function topCheck(indexCheck) {
    return (indexCheck - 10) < 0 ? false : true
  }

  function botCheck(indexCheck) {
    return (indexCheck - 10) >=  (gameStats.width * gameStats.height) ? false : true
  }

  // function wallCheck(indexCheck) {
  //   if (
  //     indexCheck % gameStats.width === 0 ||
  //     (indexCheck + 1) % gameStats.width === 0 ||
  //     indexCheck >= gameStats.width * gameStats.height ||
  //     indexCheck < 0
  //   ) {
  //     return true
  //   }
  //   return false
  // }

  // ! Click Functions

  function squareClick(e) {
    const targetSquareIndex = boardArray.indexOf(e.target)
    console.log(e)
    if (!gameState.firstClicked) {
      createRandomMines(targetSquareIndex)
      gameState.firstClicked = true
      // hitClear(targetSquareIndex)
      checkSquaresAround(targetSquareIndex)
    } else {
      clickHit(targetSquareIndex)
    }

  }






  // ! INITIALISATION FUNCTIONS


  function initialiseGame() {
    adjustBoardSize()
    createBoard()
  }

  initialiseGame()


  boardArray.forEach(square => {
    square.addEventListener('click', squareClick)
  })

}

window.addEventListener('DOMContentLoaded', init)