'use strict'

var gGame = {
    isOn: false,
    lives: 3,
    shownCount: 0,
    markedCount: 0,
}

function onCellClicked(i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    //first click handling
    if (firstClick) {
        firstClick = false
        placeMines(gBoard, i, j)
        setMinesNegsCount(gBoard)
        startTime()
    }
    //normal handling
    if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) gGame.shownCount++
    gBoard[i][j].isShown = true
    //mine handling
    if (gBoard[i][j].isMine) {
        gGame.lives--
        if (!gGame.lives) {
            var elRestart = document.querySelector('.restart')
            elRestart.innerText = LOSE
            stopTimer()
            for (var a = 0; a < gBoard.length; a++) {
                for (var b = 0; b < gBoard[0].length; b++) {
                    if (gBoard[a][b].isMine) {
                        gBoard[a][b].isShown = true
                    }
                }
            }
            gGame.isOn = false
        }
    }
    //further logic and reveal
    expandShown(gBoard, i, j)
    checkGameOver()
    renderBoard(gBoard)
}

function onCellMarked(i, j) {
    if (!gGame.isOn) return
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    if (gBoard[i][j].isMarked) {
        gGame.markedCount++
    } else {
        gGame.markedCount--
    }
    renderBoard(gBoard)
}

function checkGameOver() {
    var isWon = false
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gGame.shownCount === ((gLevel.SIZE ** 2) - gLevel.MINES)) {
                isWon = true
            }
        }
    }
    if (isWon) {
        gGame.isOn = false
        var elRestart = document.querySelector('.restart')
        elRestart.innerText = WIN
        stopTimer()
    }
}

function expandShown(board, i, j) {
    if (board[i][j].minesAroundCount !== 0) return
    if (board[i][j].isMine) return
    for (var a = i - 1; a <= i + 1; a++) {
        if (a < 0 || a >= board.length) continue
        for (var b = j - 1; b <= j + 1; b++) {
            if (b < 0 || b >= board[0].length) continue
            if (a === i && b === j) continue
            if (!board[a][b].isShown && !board[a][b].isMarked && !board[a][b].minesAroundCount) {
                if (!board[a][b].isShown) gGame.shownCount++
                board[a][b].isShown = true
                if (board[a][b].minesAroundCount === 0) {
                    expandShown(board, a, b)
                }
            }
        }
    }
}

function startTime() {
    gStartTime = new Date()
    gTimer = setInterval(updateTimer, 1000)
}

function stopTimer() {
    clearInterval(gTimer)
}

function updateTimer() {
    var elapsedTime = new Date() - gStartTime
    var seconds = Math.floor(elapsedTime / 1000) % 60
    var minutes = Math.floor(elapsedTime / 60000)
    document.querySelector(".time").innerHTML = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

