import { readFileSync } from "node:fs"

type FreeSpace = '.'

export function day9Part1() {
  const diskMap = parse(puzzleInput())

  const freeSpaceIndices: number[] = []
  const blocks: (number | FreeSpace)[] = []

  let isFileBlock = true
  let currentIdNumber = 0
  for (let i = 0; i < diskMap.length; i++) {
    const blockSize = parseInt(diskMap[i])
    if (isFileBlock) {
      for (let j = 0; j < blockSize; j++) {
        blocks.push(currentIdNumber)
      }
      currentIdNumber++
    } else {
      for (let j = 0; j < blockSize; j++) {
        blocks.push('.')
        freeSpaceIndices.push(blocks.length - 1)
      }
    }
    isFileBlock = !isFileBlock
  }

  let currentFreeSpaceIndex = freeSpaceIndices.shift()!
  let currentFileBlockIndex = blocks.length - 1

  while (currentFileBlockIndex > currentFreeSpaceIndex) {
    const block = blocks[currentFileBlockIndex]
    if (block === '.') {
      currentFileBlockIndex--
      continue
    }

    blocks[currentFreeSpaceIndex] = blocks[currentFileBlockIndex]
    blocks[currentFileBlockIndex] = '.'
    freeSpaceIndices.push(currentFileBlockIndex)

    currentFileBlockIndex--
    currentFreeSpaceIndex = freeSpaceIndices.shift()!
  }

  let checkSum = 0
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] === '.') {
      break
    }
    checkSum += i * (blocks[i] as number)
  }

  return checkSum
}

export function day9Part2() {
  throw new Error('not yet implemented')
}

function parse(input: string): string {
  return input.trim()
}

function exampleInput() {
  return '2333133121414131402'
}

function puzzleInput() {
  return readFileSync('./src/input/day9.txt').toString()
}
