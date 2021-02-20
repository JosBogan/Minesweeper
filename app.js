function init() {

  const mainContainer = document.querySelector('#main_container')
  const gameContainer = document.querySelector('#game_board_container')
  const flagsContainer = document.querySelector('#flag_container')
  const timer = document.querySelector('#timer')



  const gameStats = {
    boardWidth: 9,
    boardHeight: 9,
    squareSize: 30,
    mines: 10
  }

  const gameState = {
    firstClicked: false,
    mines: [],
    selected: [],
    flags: gameStats.mines,
    timer: 0,
    timerId: null
  }

  const boardRotation = {
    mouseDown: false,
    userClick: 0,
    userNew: 0,
    currentDeg: 0,
    rotateSpeed: 500
  }

  const boardArray = []

  // ! BOARD CREATION FUNCTIONS

  function createSquare() {
    const square = document.createElement('div')
    square.classList.add('square')
    square.style.width = `${gameStats.squareSize}px`
    square.style.height = `${gameStats.squareSize}px`
    // square.innerText = `${(i * gameStats.boardWidth) + j}`
    boardArray.push(square)

    gameContainer.appendChild(square)
  }

  function createBoard() {
    for (let i = 0; i < gameStats.boardWidth; i++) {
      for (let j = 0; j < gameStats.boardHeight; j++) {
        createSquare()
      }
    }
  }

  function adjustBoardSize() {
    gameContainer.style.width = `${gameStats.squareSize * gameStats.boardWidth}px`
    // document.documentElement.style.setProperty('--width', gameStats.boardWidth)

  }

  // ! Create Mines

  function randomMineNumber() {
    return Math.floor(Math.random() * (gameStats.boardWidth * gameStats.boardHeight))
  }

  function createRandomMines(target) {
    const avoid = [
      target, 
      target + 1, 
      target - 1, 
      target + gameStats.boardWidth, 
      target - gameStats.boardWidth, 
      target + gameStats.boardWidth + 1,
      target + gameStats.boardWidth - 1,
      target - gameStats.boardWidth + 1,
      target - gameStats.boardWidth - 1
    ]
    for (let i = 0; i < gameStats.mines; i++) {
      let mine = randomMineNumber()
      while (
        gameState.mines.includes(mine) || 
        avoid.includes(mine)
        // mine === target
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
      // propagate(targetIndex)
      checkSquaresAround(targetIndex)
      // hitClear(targetIndex)
    }

  }

  function hitMine() {
    gameState.mines.forEach(index =>{
      boardArray[index].classList.add('bomb')
    })
  }

  function hitClear(targetIndex) {
    // console.log('you\'re clear')
    gameState.selected.push(targetIndex)
    addClearBackground(boardArray[targetIndex])

  }

  function addClearBackground(element) {
    // console.log(element)
    element.classList.add('clicked')
  }

  // ! Check around recursivly 

  function getValue(targetIndex) {

    let counter = 0



    // counter = gameState.mines.filter(index => {
    //   return (
    //     index === targetIndex + 1 ||
    //     index === targetIndex - 1 ||
    //     index === targetIndex + gameStats.boardWidth ||
    //     index === targetIndex - gameStats.boardWidth ||
    //     index === targetIndex + gameStats.boardWidth + 1 ||
    //     index === targetIndex - gameStats.boardWidth - 1 ||
    //     index === targetIndex + gameStats.boardWidth - 1 ||
    //     index === targetIndex - gameStats.boardWidth + 1
    //   )
    // }).length


    if (!isFirstRow(targetIndex)) {
      if (!isLeftWall(targetIndex)) {
        if (gameState.mines.includes(targetIndex - gameStats.boardWidth - 1)) counter ++
      }
      if (!isRightWall(targetIndex)) {

        if (gameState.mines.includes(targetIndex - gameStats.boardWidth + 1)) counter ++
      }
      if (gameState.mines.includes(targetIndex - gameStats.boardWidth)) counter ++
    }

    if (!isLastRow(targetIndex)) {
      if (!isLeftWall(targetIndex)) {
        if (gameState.mines.includes(targetIndex + gameStats.boardWidth - 1)) counter ++
      }
      if (!isRightWall(targetIndex)) {

        if (gameState.mines.includes(targetIndex + gameStats.boardWidth + 1)) counter ++
      }
      if (gameState.mines.includes(targetIndex + gameStats.boardWidth)) counter ++
    }

    if (!isRightWall(targetIndex)) {
      if (gameState.mines.includes(targetIndex + 1)) counter ++

    }

    if (!isLeftWall(targetIndex)) {
      if (gameState.mines.includes(targetIndex - 1)) counter ++
    }

    return counter
  }




  function checkSquaresAround(targetIndex) {

    if (gameState.selected.includes(targetIndex)) return

    const num = getValue(targetIndex)
    if (num > 0) {
      boardArray[targetIndex].innerText = `${num}`
      hitClear(targetIndex)
    } else {

      hitClear(targetIndex)


      if (!isRightWall(targetIndex)) {
        checkSquaresAround(targetIndex + 1)
      }
      if (!isLeftWall(targetIndex)) {
        checkSquaresAround(targetIndex - 1)
      }

      if (!isFirstRow(targetIndex)) {
        if (!isLeftWall(targetIndex)) {
          checkSquaresAround(targetIndex - gameStats.boardWidth - 1)
        }
        if (!isRightWall(targetIndex)) {
          checkSquaresAround(targetIndex - gameStats.boardWidth + 1)
        }
        checkSquaresAround(targetIndex - gameStats.boardWidth)

      }

      if (!isLastRow(targetIndex)) {
        if (!isLeftWall(targetIndex)) {
          checkSquaresAround(targetIndex + gameStats.boardWidth - 1)
        }
        if (!isRightWall(targetIndex)) {
          checkSquaresAround(targetIndex + gameStats.boardWidth + 1)
        }
        checkSquaresAround(targetIndex + gameStats.boardWidth)
      }
    }
    // Check the element you are on
    // If it is a mine, return
    // if is not a mine, change the background and call self on above, below, right and left

  }


  function mainCollision(index) {
    return (
      index < 0 ||
      index > gameStats.boardHeight * gameStats.boardWidth ||
      (index + 1) % gameStats.boardWidth === 0 ||
      index % gameStats.boardWidth === 0
    )
  }

  function isFirstRow(index) {
    return index < gameStats.boardWidth
  }

  function isLastRow(index) {
    return index >= (gameStats.boardWidth * (gameStats.boardHeight - 1))
  }

  function isLeftWall(index) {
    return index % gameStats.boardWidth === 0
  }

  function isRightWall(index) {
    return (index + 1) % gameStats.boardWidth === 0
  }


  // ! Click Functions

  function squareClick(event) {
    event.stopPropagation()
    const targetSquareIndex = boardArray.indexOf(event.target)
    if (!gameState.firstClicked) {
      createRandomMines(targetSquareIndex)
      gameState.firstClicked = true

      // * TEMPORARY - TESTING BOMBS
      // gameState.mines.forEach(index =>{
      //   boardArray[index].classList.add('bomb')
      // })
      // hitClear(targetSquareIndex)

      checkSquaresAround(targetSquareIndex)
      setTimer()
    } else {
      event.target.classList.remove('flag')
      clickHit(targetSquareIndex)
    }

    winCheck()

  }

  function flag(event) {
    event.stopPropagation()
    event.preventDefault()
    const targetSquareIndex = boardArray.indexOf(event.target)
    if (gameState.selected.includes(targetSquareIndex)) return
    event.target.classList.contains('flag') ? gameState.flags++ : gameState.flags--
    flagsContainer.innerText = gameState.flags
    
    event.target.classList.toggle('flag')

    return false
  }

  // ! Countup Timer

  function setTimer() {
    gameState.timerId = setInterval(() => {
      gameState.timer++
      timer.innerText = gameState.timer
    }, 1000)
  }

  // ! Win check

  function winCheck() {
    if ((gameStats.boardHeight * gameStats.boardHeight) -  gameState.selected.length === gameStats.mines) {
      clearInterval(gameState.timerId)
      console.log('WINNER WINNER CHICKEN DINNER')
    }

  }

  // ! BoardMovement

  function setMouse(event) {
    event.stopPropagation()
    switch (event.type) {
      case 'mousedown':
        boardRotation.mouseDown = true
        boardRotation.userClick = event.pageX
        break
      case 'mouseup':
        boardRotation.mouseDown = false
        boardRotation.userClick = 0
        break
      default:
        boardRotation.mouseDown = false
        boardRotation.userClick = 0
        break
    }
  }

  function calculateRotation(event) {
    event.stopPropagation()
    if (!boardRotation.mouseDown) return
    boardRotation.userNew = event.pageX
    rotateFunction(boardRotation.userClick - boardRotation.userNew)
  }

  function rotateFunction(rot) {
    const cssRotation = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rotation'))
    // const cssRotation = document.documentElement.style.getP('--rotation')
    const newRotation = cssRotation + (rot / boardRotation.rotateSpeed)
    console.log(newRotation)
    document.documentElement.style.setProperty('--rotation', `${newRotation}deg`)
  }


  // ! INITIALISATION FUNCTIONS

  function initialseGameState() {
    timer.innerText = gameState.timer
    flagsContainer.innerText = gameState.flags
  }


  function initialiseGame() {
    adjustBoardSize()
    createBoard()
    initialseGameState()
  }

  initialiseGame()


  boardArray.forEach(square => {
    square.addEventListener('click', squareClick)
    square.addEventListener('contextmenu', flag)
  })

  mainContainer.addEventListener('mousedown', setMouse)
  document.addEventListener('mousemove', calculateRotation)
  document.addEventListener('mouseup', setMouse)

}

window.addEventListener('DOMContentLoaded', init)