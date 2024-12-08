import { readFileSync } from "node:fs"

type Position = { x: number, y: number }
type Direction = { x: number, y: number }

type ObstructionTile = '#'
type EmptyTile = '.'
type Tile = ObstructionTile | EmptyTile

export function day6Part1() {
  const { map, start, direction } = parse(puzzleInput())

  let currentPos = start
  let currentDir = direction
  const visited = new Set<string>()

  while (true) {
    visited.add(`${currentPos.x},${currentPos.y}`)
    const nextPos = { x: currentPos.x + currentDir.x, y: currentPos.y + currentDir.y }
    if (nextPos.x < 0 || nextPos.y < 0 || nextPos.x >= map[0].length || nextPos.y >= map.length) {
      break
    }

    if (map[nextPos.y][nextPos.x] === '.') {
      currentPos = nextPos
    } else {
      currentDir = turnRight(currentDir)
    }
  }

  return visited.size
}

export function day6Part2() {
  const { map, start: startPos, direction: initialDir } = parse(puzzleInput())

  let numLoops = 0
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const tile = map[y][x]
      if (tile === '#' || (x === startPos.x && y === startPos.y)) {
        continue
      }
      const newMap = map.map(row => [...row])
      newMap[y][x] = '#'
      if (isGuardStuckInLoop(newMap)) {
        numLoops++
      }
    }
  }

  return numLoops

  function isGuardStuckInLoop(map: Tile[][]) {
    const visited = new Set<string>()
    let currentPos = startPos
    let currentDir = initialDir

    while (true) {
      const nextPos = { x: currentPos.x + currentDir.x, y: currentPos.y + currentDir.y }
      if (nextPos.x < 0 || nextPos.y < 0 || nextPos.x >= map[0].length || nextPos.y >= map.length) {
        return false
      }

      if (map[nextPos.y][nextPos.x] === '.') {
        currentPos = nextPos
      } else {
        const key = visitedKeyOf(currentPos, currentDir)
        if (visited.has(key)) {
          return true
        }
        visited.add(key)
        currentDir = turnRight(currentDir)
      }
    }

    function visitedKeyOf(pos: Position, dir: Direction) {
      return `${pos.x},${pos.y},${dir.x},${dir.y}`
    }
  }
}

function turnRight(direction: Direction): Direction {
  if (direction.x === -1 && direction.y === 0) return { x: 0, y: -1 }
  if (direction.x === 0 && direction.y === -1) return { x: 1, y: 0 }
  if (direction.x === 1 && direction.y === 0) return { x: 0, y: 1 }
  if (direction.x === 0 && direction.y === 1) return { x: -1, y: 0 }

  throw new Error('Invalid direction')
}

function parse(input: string): { map: Tile[][], start: Position, direction: Direction } {
  const map: Tile[][] = []
  const rows = input.split('\n').filter(Boolean)
  let start: Position | null = null
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y].trim().split('')
    map.push(row as Tile[])
    const startX = row.indexOf('^')
    if (startX !== -1) {
      start = { x: startX, y }
      map[y][startX] = '.'
    }
  }

  return {
    map,
    start: start as Position,
    direction: { x: 0, y: -1 }
  }
}

function exampleInput() {
  return `....#.....
  .........#
  ..........
  ..#.......
  .......#..
  ..........
  .#..^.....
  ........#.
  #.........
  ......#...`
}

function puzzleInput() {
  return readFileSync('./src/input/day6.txt').toString()
}
