import { readFileSync } from "node:fs"

type Equation = {
  result: number
  operands: number[]
}

export function day7Part1() {
  const equations = parse(puzzleInput())

  let total = 0
  for (const equation of equations) {
    if (isValidEquation(equation)) {
      total += equation.result
    }
  }

  return total

  function isValidEquation(equation: Equation) {
    const results: number[] = []
    const [o, ...operands] = equation.operands
    calc(o, operands)

    return results.includes(equation.result)

    function calc(result: number, operands: number[]) {
      if (operands.length === 1) {
        results.push(result * operands[0])
        results.push(result + operands[0])
        return
      }

      const remainingOperands = operands.slice(1)
      const r1 = result * operands[0]
      calc(r1, remainingOperands)
      const r2 = result + operands[0]
      calc(r2, remainingOperands)
    }
  }
}

export function day7Part2() {
  const equations = parse(puzzleInput())

  let total = 0
  for (const equation of equations) {
    if (isValidEquation(equation)) {
      total += equation.result
    }
  }

  return total

  function isValidEquation(equation: Equation) {
    const results: number[] = []
    const [o, ...operands] = equation.operands
    calc(o, operands)

    return results.includes(equation.result)

    function calc(result: number, operands: number[]) {
      if (operands.length === 1) {
        results.push(result * operands[0])
        results.push(result + operands[0])
        results.push(concat(result, operands[0]))
        return
      }

      const remainingOperands = operands.slice(1)
      const r1 = result * operands[0]
      calc(r1, remainingOperands)
      const r2 = result + operands[0]
      calc(r2, remainingOperands)
      const r3 = concat(result, operands[0])
      calc(r3, remainingOperands)
    }

    function concat(a: number, b: number) {
      return parseInt(`${a}${b}`)
    }
  }
}

function parse(input: string): Equation[] {
  const equations: Equation[] = []

  input
    .split('\n')
    .filter(Boolean)
    .forEach((line) => {
   const [r, o] = line.split(':')
   equations.push({
     result: parseInt(r.trim()),
     operands: o.trim().split(' ').map(o => parseInt(o)),
   })
  })

  return equations
}

function exampleInput() {
  return `190: 10 19
  3267: 81 40 27
  83: 17 5
  156: 15 6
  7290: 6 8 6 15
  161011: 16 10 13
  192: 17 8 14
  21037: 9 7 18 13
  292: 11 6 16 20`
}

function puzzleInput() {
  return readFileSync('./src/input/day7.txt').toString()
}
