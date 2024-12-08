import { readFileSync } from "node:fs"

type Point = { x: number, y: number }

export function day8Part1() {
  const map = parse(puzzleInput())
  const frequencies = getFrequencies(map)
  const antiNodes = new Set<string>()

  for (const [, points] of frequencies.entries()) {
    if (points.length <= 1) {
      continue
    }

    for (let i = 0; i < points.length - 1; i++) {
      const currentPoint = points[i]
      const otherPoints = points.slice(i + 1)
      for (const otherPoint of otherPoints) {
        const dx = otherPoint.x - currentPoint.x
        const dy = otherPoint.y - currentPoint.y
        const antiNode1: Point = { x: otherPoint.x + dx, y: otherPoint.y + dy }
        const antiNode2: Point = { x: currentPoint.x - dx, y: currentPoint.y - dy }
        if (isInMap(antiNode1)) {
          antiNodes.add(pointToString(antiNode1))
        }
        if (isInMap(antiNode2)) {
          antiNodes.add(pointToString(antiNode2))
        }
      }
    }
  }

  return antiNodes.size

  function isInMap(p: Point) {
    return p.x >= 0 && p.y >= 0 && p.x < map[0].length && p.y < map.length
  }
}

export function day8Part2() {
  const map = parse(puzzleInput())
  const frequencies = getFrequencies(map)
  const antiNodes = new Set<string>()

  for (const [, points] of frequencies.entries()) {
    if (points.length <= 1) {
      continue
    }

    for (let i = 0; i < points.length - 1; i++) {
      const currentPoint = points[i]
      const otherPoints = points.slice(i + 1)
      for (const otherPoint of otherPoints) {
        const dx = otherPoint.x - currentPoint.x
        const dy = otherPoint.y - currentPoint.y
        createAntiNodes(otherPoint, dx, dy)
        createAntiNodes(currentPoint, dx * -1, dy * -1)
      }
    }
  }

  const allFrequencyPoints = Array.from(frequencies.values()).flat()
  for (const p of allFrequencyPoints) {
    antiNodes.add(pointToString(p))
  }

  return antiNodes.size

  function createAntiNodes(p: Point, dx: number, dy: number) {
    const antiNode: Point = { x: p.x + dx, y: p.y + dy }
    if (isInMap(antiNode)) {
      antiNodes.add(pointToString(antiNode))
      createAntiNodes(antiNode, dx, dy)
    }
  }

  function isInMap(p: Point) {
    return p.x >= 0 && p.y >= 0 && p.x < map[0].length && p.y < map.length
  }
}

function getFrequencies(map: string[][]) {
  const frequencies: Map<string, Point[]> = new Map()

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const frequency = map[y][x]
      if (frequency === '.') {
        continue
      }
      const points = frequencies.get(frequency) ?? []
      frequencies.set(frequency, [...points, { x, y }])
    }
  }

  return frequencies
}

function pointToString(p: Point) {
  return `${p.x},${p.y}`
}

function parse(input: string): string[][] {
  return input
    .split('\n')
    .filter(Boolean)
    .map(line => line.trim().split(''))
}

function exampleInput() {
  return `............
  ........0...
  .....0......
  .......0....
  ....0.......
  ......A.....
  ............
  ............
  ........A...
  .........A..
  ............
  ............`
}

function puzzleInput() {
  return readFileSync('./src/input/day8.txt').toString()
}
