
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
        const [stone1, stone2] = splitStone(n)
        blink([stone1, stone2], numBlinks + 1)
      } else {
        blink([n * 2024], numBlinks + 1)
      }
    })
  }
}

export function day11Part2() {
  const stones = puzzleInput()
  const maxBlinks = 75

  let stoneCounts = new Map<number, number>()

  for (const n of stones) {
    stoneCounts.set(n, 1)
  }

  for (let i = 0; i < maxBlinks; i++) {
    stoneCounts = blink(stoneCounts)
  }

  return [...stoneCounts].reduce((acc, [, count]) => acc + count, 0);

  function blink(stones: Map<number, number>) {
    const newStoneCounts = new Map<number, number>()

    for (const [n, count] of stones.entries()) {
      if (n === 0) {
        add(1, count)
      } else if (hasEvenNumberOfDigits(n)) {
        const [stone1, stone2] = splitStone(n)
        add(stone1, count)
        add(stone2, count)
      } else {
        add(n * 2024, count)
      }
    }

    return newStoneCounts

    function add(stone: number, count: number) {
      return newStoneCounts.set(stone, (newStoneCounts.get(stone) ?? 0) + count)
    }
  }
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
