import { readFileSync } from "node:fs"

type Position = { x: number, y: number }

export function day10Part1() {
  const map = parse(puzzleInput())

  const { calculateScore } = findTrailHeads(map)

  return calculateScore()
}

export function day10Part2() {
  const map = parse(puzzleInput())

  const { calculateRating } = findTrailHeads(map)

  return calculateRating()
}

function findTrailHeads(map: number[][]) {
  const trailHeads = new Map<Position, Array<Position[]>>

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const current = map[y][x]
      if (current === 0) {
        const trails : Array<Position[]> = []
        findTrailsRecursive({ x, y }, trails)
        trailHeads.set({ x, y }, trails)
      }
    }
  }

  function findTrailsRecursive(pos: Position, trails: Array<Position[]>, trail: Position[] = []) {
    if (!isInMap(pos) || alreadyVisited()) {
      return
    }

    const lastPos = trail.length > 0 ? trail[trail.length - 1] : null
    if (lastPos) {
      const currentHeight = map[pos.y][pos.x]
      const lastHeight = map[lastPos.y][lastPos.x]
      if (currentHeight - lastHeight !== 1) {
        return
      }
    }

    trail.push(pos)

    // We reached the goal
    if (map[pos.y][pos.x] === 9) {
      trails.push(trail)
      return
    }

    // Go to each possible direction
    findTrailsRecursive({ x: pos.x + 1, y: pos.y }, trails, [...trail])
    findTrailsRecursive({ x: pos.x - 1, y: pos.y }, trails, [...trail])
    findTrailsRecursive({ x: pos.x, y: pos.y + 1 }, trails, [...trail])
    findTrailsRecursive({ x: pos.x, y: pos.y - 1 }, trails, [...trail])

    function alreadyVisited() {
      return trail.find(p => p.x === pos.x && p.y === pos.y)
    }

    function isInMap(pos: Position) {
      return pos.x >= 0 && pos.y >= 0 && pos.x < map[0].length && pos.y < map.length
    }
  }

  function calculateScore() {
    let scores = 0
    for (const [, trails] of trailHeads) {
      const uniqueTrailEnds = new Set(trails.map((trail) => {
        const lastPos = trail[trail.length - 1]
        return `${lastPos.x},${lastPos.y}`
      }))
      scores += uniqueTrailEnds.size
    }
    return scores
  }

  function calculateRating() {
    let ratings = 0
    for (const [, trails] of trailHeads) {
      ratings += trails.length
    }
    return ratings
  }

  return {
    trailHeads,
    calculateScore,
    calculateRating,
  }
}

function parse(input: string): number[][] {
  return input.split('\n')
    .filter(Boolean)
    .map(line => line.trim().split('').map(l => parseInt(l)))
}

function exampleInput() {
  return `89010123
  78121874
  87430965
  96549874
  45678903
  32019012
  01329801
  10456732`
}

function puzzleInput() {
  return readFileSync('./src/input/day10.txt').toString()
}
