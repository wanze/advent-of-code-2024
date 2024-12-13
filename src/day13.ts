import { readFileSync } from "fs"

type Position = { x: number, y: number }

type ClawMachine = {
  buttonA: Position
  buttonB: Position
  prize: Position
}

export function day13Part1() {
  const machines = parse(puzzleInput())

  let totalCosts = 0
  for (const machine of machines) {
    totalCosts += minimalCost(machine)
  }

  return totalCosts

  function minimalCost(m: ClawMachine) {
    let minTokens: number | null = null

    for (let i = 1; i <= 100; i++) {
      for (let k = 1; k <= 100; k++) {
        const x = m.buttonA.x * i + m.buttonB.x * k
        const y = m.buttonA.y * i + m.buttonB.y * k
        if (x === m.prize.x && y === m.prize.y) {
          const numTokens = i * 3 + k
          if (minTokens && numTokens < minTokens) {
            minTokens = numTokens
          } else {
            minTokens = numTokens
          }
        }
      }
    }

    return minTokens ?? 0
  }
}

export function day13Part2() {
  throw new Error('not yet implemented')
}

function parse(input: string) {
  const machines: ClawMachine[] = []
  const lines = input.split('\n')
  let machine = {} as ClawMachine
  for (const line of lines) {
    if (!line) {
      machines.push(machine)
      machine = {} as ClawMachine
      continue
    }
    if (line.startsWith('Button A')) {
      machine.buttonA = parseButtonPosition(line)
    } else if (line.startsWith('Button B')) {
      machine.buttonB = parseButtonPosition(line)
    } else {
      machine.prize = parsePrize(line)
    }
  }

  return machines

  function parsePrize(line: string): Position {
    const [left, right] = line.split(',')
    return {
      x: parseInt(left.split('=')[1]),
      y: parseInt(right.split('=')[1])
    }
  }

  function parseButtonPosition(line: string): Position {
    const [left, right] = line.split(',')
    return {
      x: parseInt(left.split('+')[1]),
      y: parseInt(right.split('+')[1])
    }
  }
}

function exampleInput() {
  return readFileSync('./src/input/day13_example.txt').toString()
}

function puzzleInput() {
  return readFileSync('./src/input/day13.txt').toString()
}
