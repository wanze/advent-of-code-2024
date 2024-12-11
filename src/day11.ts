
export function day11Part1() {
  const stones = puzzleInput()
  const maxBlinks = 25
  let numStones = stones.length

  blink(stones, 0)

  return numStones

  function blink(stones: number[], numBlinks: number) {
    if (numBlinks === maxBlinks) {
      return
    }

    stones.forEach((n) => {
      if (n === 0) {
        blink([1], numBlinks + 1)
      } else if (hasEvenNumberOfDigits(n)) {
        numStones++
        const [a, b] = splitStone(n)
        blink([a, b], numBlinks + 1)
      } else {
        blink([n * 2024], numBlinks + 1)
      }
    })
  }
}

export function day11Part2() {
  throw new Error('not yet implemented')
}

function hasEvenNumberOfDigits(number: number) {
  return number.toString().length % 2 === 0
}

function splitStone(number: number): number[] {
  const n = number.toString()
  const half = n.length / 2

  return [parseInt(n.slice(0, half)), parseInt(n.slice(half))]
}

function exampleInput() {
  return [125, 17]
}

function puzzleInput() {
  return [1, 24596, 0, 740994, 60, 803, 8918, 9405859]
}
