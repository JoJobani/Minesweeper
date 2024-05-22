'use strict'

const MINE = '*'
const FLAG = 'F'
const EMPTY = ' '

var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    console.table(gBoard)
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
    var minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)
        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            minesPlaced++
        }
    }
    return board
}

function renderBoard(board) {
    var boardContainer = document.querySelector('.board')
    boardContainer.innerHTML = ''
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var elCell = document.createElement('div')
            elCell.classList.add('cell')
            elCell.dataset.i = i
            elCell.dataset.j = j
            elCell.setAttribute('onclick', `onCellClicked(${i},${j})`)

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


function onCellClicked(i, j) {
    gBoard[i][j].isShown = true
    renderBoard(gBoard)
}

function onCellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}