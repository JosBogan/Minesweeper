function init() {

  const mainContainer = document.querySelector('#main_container')
  const gameContainer = document.querySelector('#game_board_container')
  const flagsContainer = document.querySelector('#flag_container')
  const timer = document.querySelector('#timer')
  const restart = document.querySelector('#restart')

  const flip2D = document.querySelector('#d2')
  const flip3D = document.querySelector('#d3')
  const boardSizeButton = document.querySelector('.board_size_button')
  const boardSizeOptionsContainer = document.querySelector('.board_size_options')
  const boardSizeChangeButtons = document.querySelectorAll('.board_size_change_button') 



  const gameStats = {
    boardWidth: 9,
    boardHeight: 9,
    squareSize: 30,
    mines: 10
  }

  const gameState = {
    firstClicked: false,
    canPlay: true,
    mines: [],
    selected: [],
    flags: gameStats.mines,
    timer: 0,
    style: 3,
    timerId: null
  }

  const boardRotation = {
    mouseDown: false,
    userFirst: 0,
    userSecond: 0,
    currentDeg: 0,
    rotateSpeed: 5
  }

  let numOfPropagatedSquares = 0

  let boardArray = []

  // ! BOARD CREATION FUNCTIONS

  function createSquare() {
    const square = document.createElement('div')
    square.classList.add('square')
    square.id = 'square'
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
    console.log(gameStats.boardWidth)
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
      if (numOfPropagatedSquares > 10) calculateShake()
      numOfPropagatedSquares = 0
      // hitClear(targetIndex)
    }

  }

  function hitMine() {
    gameState.mines.forEach(index =>{
      boardArray[index].classList.add('bomb')
    })
    clearInterval(gameState.timerId)
    calculateShake()
    gameState.canPlay = false
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

    numOfPropagatedSquares++
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
    if (getComputedStyle(boardSizeOptionsContainer).display !== 'none') {
      openBoardSizeOptions()
    }
    if (!gameState.canPlay) return
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
      calculateShake()
      numOfPropagatedSquares = 0
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
    if (getComputedStyle(boardSizeOptionsContainer).display !== 'none') {
      openBoardSizeOptions()
    }
    if (!gameState.canPlay) return
    if (!gameState.firstClicked) return
    const targetSquareIndex = boardArray.indexOf(event.target)
    if (gameState.selected.includes(targetSquareIndex)) return
    if (event.target.classList.contains('flag')) {
      gameState.flags++
    } else {
      if (gameState.flags <= 0) return
      gameState.flags--
    }
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
    if (gameState.style === 2) return
    if (event.button === 2) return
    switch (event.type) {
      case 'mousedown':
        boardRotation.mouseDown = true
        boardRotation.userFirst = event.pageX
        break
      case 'mouseup':
        boardRotation.mouseDown = false
        boardRotation.userFirst = 0
        break
      default:
        boardRotation.mouseDown = false
        boardRotation.userFirst = 0
        break
    }
  }

  function calculateRotation(event) {
    event.stopPropagation()
    if (gameState.style === 2) return
    if (!boardRotation.mouseDown) return
    boardRotation.userSecond = event.pageX
    rotateFunction(boardRotation.userSecond - boardRotation.userFirst)
    boardRotation.userFirst = event.pageX
  }

  function rotateFunction(rot) {
    const cssRotation = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rotation'))
    // const cssRotation = document.documentElement.style.getP('--rotation')
    const newRotation = cssRotation + (rot / boardRotation.rotateSpeed)
    console.log(newRotation)
    document.documentElement.style.setProperty('--rotation', `${newRotation}deg`)
  }

  // ! ANIMATION FUNCTION

  function animationEnd(event) {
    if (gameState.style === 2) return
    if (event.animationName === 'shake') {
      gameContainer.classList.remove('shake')
    } else if (event.animationName === 'rotate') {
      restart.classList.remove('rotate')
    }
  }

  function calculateShake() {
    if (gameState.style === 2) return
    gameContainer.classList.add('shake')
  }

  // ! FLIP STYLE FUNCTION

  function flipStyle(event) {
    gameState.style = parseInt(event.target.value)

    switch (gameState.style) {
      case 2:
        changeTo2D()
        flip2D.classList.add('selected_button')
        flip3D.classList.remove('selected_button')
        break
      case 3:
        changeTo3D()
        flip3D.classList.add('selected_button')
        flip2D.classList.remove('selected_button')
        break
      default:
        changeTo3D()
        flip3D.classList.add('selected_button')
        flip2D.classList.remove('selected_button')
    }
  }

  function openBoardSizeOptions() {
    boardSizeOptionsContainer.classList.toggle('board_size_options_display')
  }

  function changeTo2D() {
    if (getComputedStyle(boardSizeOptionsContainer).display !== 'none') {
      openBoardSizeOptions()
    }
    mainContainer.classList.replace('main_container', 'main_container_2D')
    gameContainer.classList.replace('game_board_container', 'game_board_container_2D')
    document.querySelectorAll('#square').forEach(element => element.classList.replace('square', 'square_2D'))
    if (gameStats.boardWidth === 15) {
      document.querySelectorAll('#square').forEach(element => element.classList.add('square_2D_m'))
    }
    if (gameStats.boardWidth === 29) {
      document.querySelectorAll('#square').forEach(element => element.classList.add('square_2D_l'))
    }
  }

  function changeTo3D() {
    if (getComputedStyle(boardSizeOptionsContainer).display !== 'none') {
      openBoardSizeOptions()
    }
    mainContainer.classList.replace('main_container_2D', 'main_container')
    gameContainer.classList.replace('game_board_container_2D', 'game_board_container')
    document.querySelectorAll('#square').forEach(element => element.classList.replace('square_2D', 'square'))
    if (gameStats.boardWidth === 15) {
      document.querySelectorAll('#square').forEach(element => element.classList.remove('square_2D_m'))
    }
    if (gameStats.boardWidth === 29) {
      document.querySelectorAll('#square').forEach(element => element.classList.remove('square_2D_l'))
    }
  }

  function changeBoardSize(event) {
    console.log(event.target.value)
    switch (event.target.value) {
      case 's':
        gameStats.boardWidth = 9
        gameStats.boardHeight = 9
        gameStats.mines = 10
        boardSizeChangeButtons[0].classList.add('selected_button')
        boardSizeChangeButtons[1].classList.remove('selected_button')
        boardSizeChangeButtons[2].classList.remove('selected_button')
        boardSizeButton.innerHTML = '<i class="fas fa-stop"></i>'
        break
      case 'm':
        gameStats.boardWidth = 15
        gameStats.boardHeight = 15
        gameStats.mines = 40
        boardSizeChangeButtons[0].classList.remove('selected_button')
        boardSizeChangeButtons[1].classList.add('selected_button')
        boardSizeChangeButtons[2].classList.remove('selected_button')
        boardSizeButton.innerHTML = '<i class="fas fa-th-large"></i>'
        break
      case 'l':
        gameStats.boardWidth = 29
        gameStats.boardHeight = 16
        gameStats.mines = 99
        boardSizeChangeButtons[0].classList.remove('selected_button')
        boardSizeChangeButtons[1].classList.remove('selected_button')
        boardSizeChangeButtons[2].classList.add('selected_button')
        boardSizeButton.innerHTML = '<i class="fas fa-th"></i>'
        break
    }
    openBoardSizeOptions()
    removeOldBoard()
    initialiseGame()
    addEventsToSquares()
    resetFunction()

    if (gameState.style === 2) {
      changeTo2D()
    }
  }


  // ! INITIALISATION FUNCTIONS

  function removeOldBoard() {
    gameContainer.innerHTML = ''
    boardArray = []
  }

  function resetDomGameState() {
    timer.innerText = gameState.timer
    flagsContainer.innerText = gameState.flags
  }


  function initialiseGame() {
    adjustBoardSize()
    createBoard()
    resetDomGameState()
  }

  function resetGameState() {

    clearInterval(gameState.timerId)
    console.log('getting here')

    gameState.firstClicked = false
    gameState.canPlay = true
    gameState.mines = []
    gameState.selected = []
    gameState.flags = gameStats.mines
    gameState.timer = 0
    gameState.timerId = null

  }

  function resetClasses() {
    boardArray.forEach(element => {
      element.classList.remove('bomb')
      element.classList.remove('clicked')
      element.classList.remove('flag')
      element.innerText = ''
    })
  }


  function resetFunction() {
    resetClasses()
    resetGameState()
    resetDomGameState()
  }

  function resetGame(event) {
    if (event.code === 'KeyZ') {
      resetFunction()
    }
  }

  function addEventsToSquares() {
    boardArray.forEach(square => {
      square.addEventListener('click', squareClick)
      square.addEventListener('contextmenu', flag)
    })

  }

  initialiseGame()
  addEventsToSquares()



  mainContainer.addEventListener('mousedown', setMouse)
  document.addEventListener('mouseup', setMouse)
  document.addEventListener('mousemove', calculateRotation)
  
  document.addEventListener('keypress', resetGame)

  document.addEventListener('animationend', animationEnd)


  restart.addEventListener('click', () => {
    if (!gameState.firstClicked) return
    console.log('here')
    restart.classList.add('rotate')
    resetFunction()
  })
  flip3D.addEventListener('click', flipStyle)
  flip2D.addEventListener('click', flipStyle)
  boardSizeButton.addEventListener('click', openBoardSizeOptions)


  boardSizeChangeButtons.forEach(button => {
    button.addEventListener('click', changeBoardSize)
  })

}

window.addEventListener('DOMContentLoaded', init)