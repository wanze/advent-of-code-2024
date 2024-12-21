import { readFileSync } from "fs"

type FreeTile = '.'
type WallTile = '#'
type Tile = FreeTile | WallTile

type Position = { x: number, y: number }
type Direction = 'up' | 'down' | 'left' | 'right'

type Node = {
  x: number
  y: number
  cost: number
  direction?: Direction
  previousNodes: Node[]
}

class Queue {
  private nodes: Node[] = []

  enqueue(node: Node) {
    this.nodes.push(node)
  }

  find(x: number, y: number) {
    return this.nodes.find(node => node.x === x && node.y === y)
  }

  dequeue() {
    return this.nodes
      .sort((a, b) => a.cost - b.cost)
      .shift()
  }

  isNotEmpty() {
    return this.nodes.length > 0
  }
}

export function day16Part1() {
  const { map, startPos, goalPos } = parse(puzzleInput())

  const queue = buildQueue(map, startPos)

  while (queue.isNotEmpty()) {
    const current = queue.dequeue() as Node
    if (current.x === goalPos.x && current.y === goalPos.y) {
      return current.cost
    }

    if (map[current.y][current.x + 1] === '.') {
      updateNeighbour(1, 0, 'right')
    }
    if (map[current.y][current.x - 1] === '.') {
      updateNeighbour(-1, 0, 'left')
    }
    if (map[current.y + 1][current.x] === '.') {
      updateNeighbour(0, 1, 'down')
    }
    if (map[current.y - 1][current.x] === '.') {
      updateNeighbour(0, -1, 'up')
    }

    function updateNeighbour(dX: number, dY: number, direction: Direction) {
      const neighbour = queue.find(current.x + dX, current.y + dY)
      if (!neighbour) {
        return
      }
      const cost = current.cost + 1 + numTurns(current.direction!, direction) * 1000
      if (cost < neighbour.cost) {
        neighbour.cost = cost
        neighbour.previousNodes.push(current)
        neighbour.direction = direction
      }
    }
  }
}

export function day16Part2() {
  const { map, startPos, goalPos } = parse(exampleInput())

  const queue = buildQueue(map, startPos)
  const visitedNodes = new Map<string, Node>()
  const nodesOnBestPaths = new Set<string>()

  while (queue.isNotEmpty()) {
    const current = queue.dequeue() as Node

    visitedNodes.set(nodeToString(current), current)

    if (current.x === goalPos.x && current.y === goalPos.y) {
      traverse(current)
      return nodesOnBestPaths.size
    }

    if (map[current.y][current.x + 1] === '.') {
      updateNeighbour(1, 0, 'right')
    }
    if (map[current.y][current.x - 1] === '.') {
      updateNeighbour(-1, 0, 'left')
    }
    if (map[current.y + 1][current.x] === '.') {
      updateNeighbour(0, 1, 'down')
    }
    if (map[current.y - 1][current.x] === '.') {
      updateNeighbour(0, -1, 'up')
    }

    function updateNeighbour(dX: number, dY: number, direction: Direction) {
      const neighbour = queue.find(current.x + dX, current.y + dY) ?? visitedNodes.get(`${current.x + dX},${current.y + dY}`)
      if (!neighbour) {
        return
      }

      const cost = current.cost + 1 + numTurns(current.direction!, direction) * 1000
      // if (neighbour.x === 3 && neighbour.y === 9) {
        // console.log(current)
        // console.log(cost)
      // }
      neighbour.previousNodes.push(current)
      if (cost <= neighbour.cost) {
        neighbour.cost = cost
        neighbour.direction = direction
      }
    }
  }

  function nodeToString(node: Node) {
    return `${node.x},${node.y}`
  }

  function traverse(node: Node) {
    nodesOnBestPaths.add(nodeToString(node))
    node.previousNodes
      .filter(n => !nodesOnBestPaths.has(nodeToString(n)))
      .forEach(n => traverse(n))
  }
}

function buildQueue(map: Tile[][], startPos: Position) {
  const queue = new Queue()

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map.length; x++) {
      if (map[y][x] === '#') {
        continue
      }
      const cost = x === startPos.x && y === startPos.y ? 0 : Infinity
      queue.enqueue({ x, y, cost, direction: 'right', previousNodes: [] })
    }
  }

  return queue
}

function numTurns(currentDir: Direction, goalDir: Direction) {
  if (currentDir === goalDir) return 0
  if (currentDir === 'up' && goalDir === 'down') return 2
  if (currentDir === 'down' && goalDir === 'up') return 2
  if (currentDir === 'left' && goalDir === 'right') return 2
  if (currentDir === 'right' && goalDir === 'left') return 2

  return 1
}

function parse(input: string): { map: Tile[][], startPos: Position, goalPos: Position } {
  let startPos = { x: 0, y: 0 }
  let goalPos = { x: 0, y: 0 }
  const map = input
    .split('\n')
    .filter(Boolean)
    .map((line, y) => {
      const row = line.trim().split('')
      const startX = row.indexOf('S')
      if (startX > -1) {
        startPos = { x: startX, y }
        row[startX] = '.'
      }
      const goalX = row.indexOf('E')
      if (goalX > -1) {
        goalPos = { x: goalX, y }
        row[goalX] = '.'
      }
      return row as Tile[]
    })

  return { map, startPos, goalPos }
}

function puzzleInput() {
  return readFileSync('./src/input/day16.txt').toString()
}

function exampleInput() {
  return `###############
  #.......#....E#
  #.#.###.#.###.#
  #.....#.#...#.#
  #.###.#####.#.#
  #.#.#.......#.#
  #.#.#####.###.#
  #...........#.#
  ###.#.#####.#.#
  #...#.....#.#.#
  #.#.#.###.#.#.#
  #.....#...#.#.#
  #.###.#.#.#.#.#
  #S..#.....#...#
  ###############`
}
