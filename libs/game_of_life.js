let mouseIn = (x, y, w, h) => {
    return (Math.abs(x - mouseX) < w/2 && Math.abs(y - mouseY) < h/2)
}

class Cell {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.alive = false
        this.clickFlag = true
    }

    update() {
        this.updated = true
    }

    render(mode) {
        push()
        this.events(mode)
        fill(this.alive ? 'while' : 'black')
        rect(this.x, this.y, this.width, this.height)
        pop()
    }

    events(mode) {
        this.preload(mode)
        this.listeners()
    }

    die() {
        this.alive = false
    }

    revive() {
        this.alive = true
    }

    live() {
        return this.alive
    }

    preload(mode) {
        if (mode == 'STARTED') return
        this.hover()
        this.click()
    }

    listeners() {

    }

    click() {
        if (this.clickFlag && this.mouseIn() && mouseIsPressed) {
            this.swap()
            this.clickFlag = false
        }

        if (!mouseIsPressed) {
            this.clickFlag = true
        }
    }

    mouseIn() {
        return mouseIn(this.x, this.y, this.width, this.height)
    }

    hover() {
        if (this.mouseIn()) {
            stroke('red')
        }
    }

    

    swap() {
        this.alive = ! this.alive
    }
}

class Grid {
    constructor(width, height, rows, columns) {
        this.width = width
        this.height = height
        this.rows = rows
        this.columns = columns
        this.cells = []
        this.init()
    }

    init() {
        let width = this.width / this.columns
        let height = this.height / this.rows
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                this.cells.push(
                    new Cell(
                        j * width + width/ 2,
                        i * height + height / 2,
                        width,
                        height
                    )
                )
            }
        }
    }

    render(mode) {
        this.cells.forEach(cell => cell.render(mode))
    }

    get(i, j) {
        return this.cells[i * this.rows + j]
    }

    getAdjacentCells(i, j) {
        let n = this.rows
        let m = this.columns
        let result = []

        if (i-1 >= 0) result.push(this.get(i-1, j))
        if (j-1 >= 0) result.push(this.get(i, j-1))
        if (i+1 < n) result.push(this.get(i+1, j))
        if (j+1 < m) result.push(this.get(i, j+1))

        if (i-1 >= 0 && j-1 >= 0) result.push(this.get(i-1, j-1))
        if (i+1 < n && j-1 >= 0) result.push(this.get(i+1, j-1))
        if (i+1 < n && j+1 < m) result.push(this.get(i+1, j+1))
        if (i-1 >= 0 && j+1 < m) result.push(this.get(i-1, j+1))

        return result.filter(cell => cell.alive).length
    }
}

class GameOfLife {
    constructor(width, height, rows, columns) {
        this.width = width
        this.height = height
        this.rows = rows
        this.columns = columns
        this.grid = new Grid(width, height, rows, columns)
        this.time = 0
        this.mode = 'STOPPED'
    }

    run(deltaTime) {
        this.time += deltaTime
        this.events()
        this.grid.render(this.mode)
    }

    swap(i, j) {
        this.grid.cells[rows * i + j].swap()
    }

    events() {
        this.startEvent()
        this.update()
    }

    startEvent() {
        if (this.mode != 'STOPPED') return
        if (mouseIsPressed && mouseButton == RIGHT) {
            this.start()
        }
    }

    start() {
        this.mode = 'STARTED'
    }

    stop() {
        this.mode = 'STOPPED'
    }

    update() {
        if (this.mode != 'STARTED') return

        if (this.time > 500) {
            this.time = 0
        } else {
            return
        }

        let adjacencyCount = []

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                let cnt = this.grid.getAdjacentCells(i, j)
                adjacencyCount.push(cnt)
            }
        }

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                let cell = this.grid.get(i, j)
                let cnt = adjacencyCount[i * this.rows + j]
                if (cell.live() && (cnt == 2 || cnt == 3)) continue
                else if (!cell.live() && cnt == 3) cell.revive()
                else cell.die()
            }
        }

        console.log('Updated successfully!')
    }
}