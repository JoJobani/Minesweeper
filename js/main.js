'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '
const NORMAL = '😃'
const LOSE = '🤯'
const WIN = '😎'

var firstClick = true
var gStartTime
var gTimer
var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    if (gStartTime) {
        stopTimer()
    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    firstClick = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.lives = 3
    gGame.isOn = true
    var elRestart = document.querySelector('.restart')
    elRestart.innerText = NORMAL
}

function chooseLevel(elBtn) {
    gLevel.SIZE = parseInt(elBtn.dataset.size)
    if (gLevel.SIZE === 4) gLevel.MINES = 2
    if (gLevel.SIZE === 8) gLevel.MINES = 14
    if (gLevel.SIZE === 12) gLevel.MINES = 32
    onInit()
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function placeMines(board, firstI, firstJ) {
    var minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)
        if (i !== firstI && j !== firstJ && !board[i][j].isMine) {
            board[i][j].isMine = true
            minesPlaced++
        }
    }
}

function renderBoard(board) {
    var boardContainer = document.querySelector('.board')
    boardContainer.innerHTML = ''
    boardContainer.style.gridTemplateColumns = `repeat(${gLevel.SIZE}, 50px)`
    //lives counter
    var elLives = document.querySelector('.lives')
    elLives.innerHTML = `lives: ${gGame.lives}`
    //render
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var elCell = document.createElement('div')
            elCell.classList.add('cell')
            elCell.dataset.i = i
            elCell.dataset.j = j
            //left click functionality
            elCell.addEventListener('click', function (event) {
                onCellClicked(parseInt(event.target.dataset.i), parseInt(event.target.dataset.j))
            })
            //right click functionality
            elCell.addEventListener('contextmenu', function (event) {
                event.preventDefault()
                onCellMarked(parseInt(event.target.dataset.i), parseInt(event.target.dataset.j))
            })
            if (board[i][j].isShown) {
                elCell.classList.add('shown')
                if (board[i][j].isMine) {
                    elCell.classList.add('mine')
                    elCell.innerText = MINE
                } else if (board[i][j].minesAroundCount > 0) {
                    elCell.innerText = board[i][j].minesAroundCount
                } else {
                    elCell.innerText = EMPTY
                }
            } else if (board[i][j].isMarked) {
                elCell.classList.add('flag')
                elCell.innerText = FLAG
            }
            boardContainer.appendChild(elCell)
        }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNegs(i, j, board)
            }
        }
    }
}

function countNegs(cellI, cellJ, board) {
    var mineCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine) mineCount++
        }
    }
    return mineCount
}

function onDarkToggle(){
    var elBody = document.body
    elBody.classList.toggle('dark-mode')
}