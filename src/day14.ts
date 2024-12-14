import { readFileSync } from "fs"

type Position = { x: number, y: number }
type Velocity = { x: number, y: number }
type Grid = { width: number, height: number }

class Robot {
  private pos: Position
  private velocity: Velocity

  constructor(pos: Position, velocity: Velocity) {
    this.pos = pos
    this.velocity = velocity
  }

  move({ width, height }: Grid) {
    let newX = this.pos.x + this.velocity.x
    let newY = this.pos.y + this.velocity.y
    if (newX < 0) newX = width + newX
    if (newX > (width - 1)) newX = newX - width
    if (newY < 0) newY = height + newY
    if (newY > (height - 1)) newY = newY - height
    this.pos.x = newX
    this.pos.y = newY
  }

  currentPos() {
    return this.pos
  }
}

export function day14Part1() {
  const robots = parse(puzzleInput())
  const grid = { width: 101, height: 103 }
  const numSeconds = 100

  for (let i = 1; i <= numSeconds; i++) {
    for (const robot of robots) {
      robot.move(grid)
    }
  }

  return calculateSafetyFactor()

  function calculateSafetyFactor() {
    const middleX = (grid.width - 1) / 2
    const middleY = (grid.height - 1) / 2
    const numRobotsPerQuadrant = [0, 0, 0, 0]

    for (const robot of robots) {
      const pos = robot.currentPos()
      if (pos.x === middleX || pos.y === middleY) {
        continue
      }
      const quadrant = positionToQuadrant(pos)
      numRobotsPerQuadrant[quadrant]++
    }

    return numRobotsPerQuadrant.reduce((acc, num) => acc * num)

    function positionToQuadrant(pos: Position) {
      if (pos.x < middleX && pos.y < middleY) {
        return 0
      } else if (pos.x > middleX && pos.y < middleY) {
        return 1
      } else if (pos.x < middleX && pos.y > middleY) {
        return 2
      } else if (pos.x > middleX && pos.y > middleY) {
        return 3
      }

      throw new Error('Invalid position')
    }
  }
}

export function day14Part2() {
  const robots = parse(puzzleInput())
  const grid = { width: 101, height: 103 }
  const numSeconds = 10000

  for (let i = 1; i <= numSeconds; i++) {
    for (const robot of robots) {
      robot.move(grid)
    }
    if (getMaxNumOfRobotsOnSameXPosition() > 30) {
      print(i, robots)
    }
  }

  function getMaxNumOfRobotsOnSameXPosition() {
    let max = 0
    for (let x = 0; x < grid.width; x++) {
      const num = robots.filter(r => r.currentPos().x === x).length
      if (num > max) {
        max = num
      }
    }
    return max
  }

  function print(second: number, robots: Robot[]) {
    console.log(`Second: ${second}`)
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const hasRobot = robots.some(r => r.currentPos().x === x && r.currentPos().y === y)
        process.stdout.write(hasRobot ? '■' : ' ')
      }
      process.stdout.write('\n')
    }
  }
}

function parse(input: string) {
  return input
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [, px, py, vx, vy] = line.trim().match(/^p=(.+),(.+) v=(.+),(.+)$/)!
      return new Robot({ x: parseInt(px), y: parseInt(py) },{ x: parseInt(vx), y: parseInt(vy) })
  })
}

function exampleInput() {
  return `p=0,4 v=3,-3
  p=6,3 v=-1,-3
  p=10,3 v=-1,2
  p=2,0 v=2,-1
  p=0,0 v=1,3
  p=3,0 v=-2,-2
  p=7,6 v=-1,-3
  p=3,0 v=-1,-2
  p=9,3 v=2,3
  p=7,3 v=-1,2
  p=2,4 v=2,-3
  p=9,5 v=-3,-3`
}

function puzzleInput() {
  return readFileSync('./src/input/day14.txt').toString()
}
