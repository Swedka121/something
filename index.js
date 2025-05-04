const pitch = []
const pitchEl = document.getElementById("pitch")
let score = 0
let gameover = false
const scoreEl = document.querySelector("#score")
const snake = []
let addNail = false
let isChangesDir = false
const apple = { x: 0, y: 0 }

function resetPitch() {
    for (let i = 0; i < 10; i++) {
        pitch[i] = []
        for (let i2 = 0; i2 < 10; i2++) {
            pitch[i].push({ x: i, y: i2, snake: false, apple: false, snake_head: false, snake_index: 0 })
        }
    }
}

resetPitch()

function renderPitch() {
    const rows = document.querySelectorAll("#row")
    const cells = document.querySelectorAll("#cell")

    rows.forEach((el) => el.remove())
    cells.forEach((el) => el.remove())

    pitch.forEach((el) => {
        const row = document.createElement("div")
        row.id = "row"
        row.classList.add("row")
        pitchEl.appendChild(row)
        el.forEach((el_) => {
            const cell = document.createElement("div")
            cell.id = "cell"
            if (el_.snake) {
                cell.classList.add("cell_snake")
                if (snake[el_.snake_index].dir == "top" || snake[el_.snake_index].dir == "down") {
                    cell.style.backgroundImage = `url(./text/snake-vertical.png)`
                } else cell.style.backgroundImage = `url(./text/snake-horizontal.png)`
                if (snake[el_.snake_index + 1]) {
                    if (snake[el_.snake_index + 1].dir != snake[el_.snake_index].dir) {
                        cell.style.backgroundImage = `url(./text/snake-${snake[el_.snake_index].dir}-${
                            snake[el_.snake_index + 1].dir
                        }.png)`
                    }
                    console.log(`url(./text/snake-${snake[el_.snake_index].dir}-${snake[el_.snake_index + 1].dir}.png)`)
                }
            } else if (el_.apple) {
                cell.classList.add("cell_apple")
                cell.style.backgroundImage = `url(./text/Apple.png)`
            } else if (el_.snake_head) {
                cell.classList.add("cell_snake_head")
                cell.style.backgroundImage = `url(./text/snakeHead-${snake[el_.snake_index].dir}.png)`
            } else if ((el_.x + el_.y) % 2 == 0) cell.classList.add("cell_1")
            else cell.classList.add("cell_2")
            row.appendChild(cell)
        })
    })
}

function makeRandomApple() {
    const x = Math.floor(Math.random() * 10)
    const y = Math.floor(Math.random() * 10)
    apple.x = x
    apple.y = y

    if (snake.find((a) => a.pos_x == x && a.pos_y == y)) makeRandomApple()
}

function generateSnake() {
    const x = Math.floor(Math.random() * 10)
    const y = Math.floor(Math.random() * 10)
    let x_nail = null
    let y_nail = null
    let dir = ""
    pitch[x][y].snake_head = true

    snake.push({ head: true, parent: null, dir: null, pos_x: x, pos_y: y })
    if (checkIsEmptyCell(x + 1, y)) {
        x_nail = x + 1
        y_nail = y
        dir = "right"
    } else if (checkIsEmptyCell(x - 1, y)) {
        x_nail = x - 1
        y_nail = y
        dir = "left"
    } else if (checkIsEmptyCell(x, y + 1)) {
        x_nail = x
        y_nail = y + 1
        dir = "down"
    } else {
        x_nail = x
        y_nail = y - 1
        dir = "top"
    }

    snake.push({ head: false, parent: 0, dir, pos_x: x_nail, pos_y: y_nail })
    snake[0].dir = dir
}

function checkIsEmptyCell(posx, posy) {
    if (posx <= 9 && posx >= 0 && posy <= 9 && posy >= 0) {
        const cell = pitch[posx][posy]
        if (cell.snake) return false
        if (cell.snake_head) return false
        if (cell.apple) return false
        return true
    } else return false
}

function renderSnake() {
    snake.forEach((el, i) => {
        try {
            if (el.head == true) {
                pitch[el.pos_x][el.pos_y].snake_head = true
            } else {
                pitch[el.pos_x][el.pos_y].snake = true
                pitch[el.pos_x][el.pos_y].snake_index = i
            }
        } catch (err) {
            gameover = true
        }
    })
}

function renderApple() {
    pitch[apple.x][apple.y].apple = true
}

function moveSnake() {
    const dir = snake[0].dir
    if (addNail) {
        snake.push({ parent: snake.length - 1, head: false })
        addNail = false
    }
    for (let i = snake.length - 1; i >= 0; i--) {
        if (snake[i].head) {
            if (dir == "right") {
                snake[i].pos_x += 1
            } else if (dir == "left") {
                snake[i].pos_x -= 1
            } else if (dir == "top") {
                snake[i].pos_y += 1
            } else {
                snake[i].pos_y -= 1
            }
            if (snake[i].pos_x == apple.x && snake[i].pos_y == apple.y) {
                addNail = true
                score++
                makeRandomApple()
            }
            if (snake.find((a) => a.pos_x == snake[i].pos_x && a.pos_y == snake[i].pos_y && a.head == false)) {
                gameover = true
            }
        } else {
            snake[i] = { ...snake[snake[i].parent], parent: snake[i].parent, head: false }
        }
    }
}

function updateScore() {
    scoreEl.textContent = `Score: ${score}`

    if (gameover) {
        scoreEl.textContent = `Gameover`
    }
}

window.addEventListener("keydown", (ev) => {
    if (!isChangesDir) {
        switch (ev.key) {
            case "ArrowUp": {
                if (snake[0].dir != "right") snake[0].dir = "left"
                break
            }
            case "ArrowDown": {
                if (snake[0].dir != "left") snake[0].dir = "right"
                break
            }
            case "ArrowRight": {
                if (snake[0].dir != "down") snake[0].dir = "top"
                break
            }
            case "ArrowLeft": {
                if (snake[0].dir != "top") snake[0].dir = "down"
                break
            }
        }
        isChangesDir = true
    }
})

makeRandomApple()
generateSnake()

let int = setInterval(() => {
    resetPitch()
    moveSnake()
    renderSnake()
    renderApple()
    renderPitch()
    updateScore()
    isChangesDir = false
    if (gameover) clearInterval(int)
}, 500)
