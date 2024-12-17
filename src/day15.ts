import { readFileSync } from "fs"

type WallTile = '#'
type BoxTile = 'O'
type EmptyTile = '.'
type Tile = WallTile | BoxTile | EmptyTile

type Up = '^'
type Down = 'v'
type Left = '<'
type Right = '>'
type Direction = Up | Down | Left | Right

type Position = { x: number, y: number }

export function day15Part1() {
  const { map, movements, robotPos } = parse(puzzleInput())

  for (const direction of movements) {
    if (direction === '>') {
      if (map[robotPos.y][robotPos.x + 1] === '#') {
        continue
      }
      if (map[robotPos.y][robotPos.x + 1] === '.') {
        robotPos.x++
        continue
      }
      if (map[robotPos.y][robotPos.x + 1] === 'O') {
        for (let x = robotPos.x + 2; x < map[0].length; x++) {
          if (map[robotPos.y][x] === '#') {
            break
          }
          if (map[robotPos.y][x] === '.') {
            robotPos.x++
            map[robotPos.y][robotPos.x] = '.'
            map[robotPos.y][x] = 'O'
            break
          }
        }
      }
    } else if (direction === '<') {
      if (map[robotPos.y][robotPos.x - 1] === '#') {
        continue
      }
      if (map[robotPos.y][robotPos.x - 1] === '.') {
        robotPos.x--
        continue
      }
      if (map[robotPos.y][robotPos.x - 1] === 'O') {
        for (let x = robotPos.x - 2; x >= 0; x--) {
          if (map[robotPos.y][x] === '#') {
            break
          }
          if (map[robotPos.y][x] === '.') {
            robotPos.x--
            map[robotPos.y][robotPos.x] = '.'
            map[robotPos.y][x] = 'O'
            break
          }
        }
      }
    } else if (direction === 'v') {
      if (map[robotPos.y + 1][robotPos.x] === '#') {
        continue
      }
      if (map[robotPos.y + 1][robotPos.x] === '.') {
        robotPos.y++
        continue
      }
      if (map[robotPos.y + 1][robotPos.x] === 'O') {
        for (let y = robotPos.y + 2; y < map.length; y++) {
          if (map[y][robotPos.x] === '#') {
            break
          }
          if (map[y][robotPos.x] === '.') {
            robotPos.y++
            map[robotPos.y][robotPos.x] = '.'
            map[y][robotPos.x] = 'O'
            break
          }
        }
      }
    } else if (direction === '^') {
      if (map[robotPos.y - 1][robotPos.x] === '#') {
        continue
      }
      if (map[robotPos.y - 1][robotPos.x] === '.') {
        robotPos.y--
        continue
      }
      if (map[robotPos.y - 1][robotPos.x] === 'O') {
        for (let y = robotPos.y - 2; y >= 0; y--) {
          if (map[y][robotPos.x] === '#') {
            break
          }
          if (map[y][robotPos.x] === '.') {
            robotPos.y--
            map[robotPos.y][robotPos.x] = '.'
            map[y][robotPos.x] = 'O'
            break
          }
        }
      }
    }
  }

  let sum = 0
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'O') {
        sum += (100 * y) + x
      }
    }
  }

  return sum
}

export function day15Part2() {
  return 0
}

function printMap(map: Tile[][], robotPos: Position) {
  console.log(map.map((row, y) => {
    return row.map((tile, x) => {
      return (x === robotPos.x && y === robotPos.y) ? '@' : tile
    }).join('')
  }).join('\n'))
}

function parse(input: string): { map: Tile[][], movements: Direction[], robotPos: Position } {
  const [mapRaw, directions] = input.split('\n\n')
  const map: Tile[][] = []
  let robotPos = { x: 0, y: 0 }
  mapRaw.split('\n').forEach((line, y) => {
    const row = line.trim().split('') as (Tile | '@')[]
    const robotX = row.findIndex(tile => tile === '@')
    if (robotX > -1) {
      row[robotX] = '.'
      robotPos = { x: robotX, y }
    }
    map.push(row as Tile[])
  })

  return {
    map,
    movements: directions.trim().split('') as Direction[],
    robotPos,
  }
}

function miniInput() {
  return `########
  #..O.O.#
  ##@.O..#
  #...O..#
  #.#.O..#
  #...O..#
  #......#
  ########

  <^^>>>vv<v>>v<<`
}

function puzzleInput() {
  return readFileSync('./src/input/day15.txt').toString()
}

function exampleInput() {
  return readFileSync('./src/input/day15_example.txt').toString()
}
