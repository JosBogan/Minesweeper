function init() {

  const gameContainer = document.querySelector('#game_board_container')
  console.log(gameContainer)

  const gameStats = {
    boardWidth: 8,
    boardHeight: 8,
    squareSize: 30,
    mines: 10
  }

  const boardArray = []

  // ! BOARD CREATION FUNCTIONS

  function createSquare() {
    const square = document.createElement('div')
    square.classList.add('square')
    square.style.width = `${gameStats.squareSize}px`
    square.style.height = `${gameStats.squareSize}px`
    boardArray.push(square)

    gameContainer.appendChild(square)
  }

  function createBoard() {
    for (let i = 0; i < gameStats.boardWidth; i++) {
      console.log('width', i)
      for (let j = 0; j < gameStats.boardHeight; j++) {
        console.log('height', i)
        createSquare()
      }
    }
  }

  function adjustBoardSize() {
    gameContainer.style.width = `${gameStats.squareSize * gameStats.boardWidth}px`
  }

  // ! Click Functions

  function squareClick() {
    
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