import { readFileSync } from "node:fs"

type Coordinate = { x: number, y: number }

export function day4Part1() {
  const letters = parse(puzzleInput())

  const directions: Coordinate[] = [
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 }, // right
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 }, // down
    { x: -1, y: -1 }, // up left
    { x: 1, y: 1 }, // down right
    { x: -1, y: 1 }, // down left
    { x: 1, y: -1 }, // up right
  ]

  let count = 0
  for (let y = 0; y < letters.length; y++) {
    for (let x = 0; x < letters[y].length; x++) {
      const letter = letters[y][x]
      if (letter !== 'X') {
        continue
      }
      for (const direction of directions) {
        const coordinate: Coordinate = { x: x + direction.x, y: y + direction.y }
        if (checkXmas({ coordinate, direction, letter: 'M' })) {
          count++
        }
      }
    }
  }

  return count

  function checkXmas({ coordinate: c, direction, letter }: {
    coordinate: Coordinate,
    direction: Coordinate,
    letter: 'M' | 'A' | 'S'
  }) {
    if (c.x < 0 || c.y < 0 || c.y >= letters.length || c.x >= letters[c.y].length) {
      return false
    }

    if (letters[c.y][c.x] !== letter) {
      return false
    }

    if (letter === 'S') {
      return true
    }

    return checkXmas({
      coordinate: { x: c.x + direction.x, y: c.y + direction.y },
      direction,
      letter: nextLetter() as typeof letter
    })

    function nextLetter() {
      if (letter === 'M') return 'A'
      if (letter === 'A') return 'S'
      if (letter === 'S') throw new Error('No next letter')
    }
  }
}

export function day4Part2() {
  const letters = parse(puzzleInput())

  let count = 0
  for (let y = 0; y < letters.length; y++) {
    for (let x = 0; x < letters[y].length; x++) {
      const letter = letters[y][x]
      if (letter !== 'A') {
        continue
      }
      if (x >= 1 && y >= 1 && x <= letters[0].length - 2 && y <= letters.length - 2) {
        if ((letters[y - 1][x - 1] === 'M' && letters[y + 1][x + 1] === 'S') || (letters[y - 1][x - 1] === 'S' && letters[y + 1][x + 1] === 'M')) {
          if ((letters[y - 1][x + 1] === 'M' && letters[y + 1][x - 1] === 'S') || (letters[y - 1][x + 1] === 'S' && letters[y + 1][x - 1] === 'M')) {
            count++
          }
        }
      }
    }
  }

  return count
}

function parse(input: string): string[][] {
  return input.split('\n').map(line => line.trim().split(''))
}

function exampleInput() {
  return `MMMSXXMASM
  MSAMXMSMSA
  AMXSXMAAMM
  MSAMASMSMX
  XMASAMXAMM
  XXAMMXXAMA
  SMSMSASXSS
  SAXAMASAAA
  MAMMMXMMMM
  MXMXAXMASX`
}

function puzzleInput() {
  return readFileSync('./src/input/day4.txt').toString()
}
