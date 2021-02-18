let width = 400
let height = 400
let rows = 40
let columns = 40

let game = new GameOfLife(width, height, rows, columns)

function setup() {
    createCanvas(400, 400)
    rectMode(CENTER)
    stroke('gray')
    frameRate(60)
}

function draw() {
    background(220)
    game.run(deltaTime)
}