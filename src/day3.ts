import { readFileSync } from "node:fs"

type MulInstruction = {
  type: 'mul'
  a: number
  b: number
}

type DoInstruction = {
  type: 'do'
}

type DontInstruction = {
  type: "don't"
}

type Instruction = MulInstruction | DoInstruction | DontInstruction

export function day3Part1() {
  const instructions = parse(puzzleInput())
  let sum = 0
  for (const instruction of instructions) {
    if (instruction.type === 'mul') {
      sum += instruction.a * instruction.b
    }
  }
  return sum
}

export function day3Part2() {
  const instructions = parse(puzzleInput())
  let sum = 0
  let isEnabled = true
  for (const instruction of instructions) {
    if (instruction.type === 'mul' && isEnabled) {
      sum += instruction.a * instruction.b
    } else {
      isEnabled = instruction.type === 'do'
    }
  }
  return sum
}

function parse(input: string): Instruction[] {
  const matches = input.matchAll(/(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\))/g)
  const instructions: Instruction[] = []
  for (const match of matches) {
    if (match[0] === 'do()') {
      instructions.push({ type: 'do' })
    } else if (match[0] === "don't()") {
      instructions.push({ type: "don't" })
    } else {
      instructions.push({
        type: 'mul',
        a: parseInt(match[2]),
        b: parseInt(match[3])
      })
    }
  }

  return instructions
}

function exampleInputPart1() {
  return `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`
}

function exampleInputPart2() {
  return `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`
}

function puzzleInput() {
  return readFileSync('./src/input/day3.txt').toString()
}
