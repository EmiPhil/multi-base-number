const tap = require('tap')
const MBN = require('../mbn')

// * Random tests - each test run will produce a different pattern etc so that we dont accidentally
// * build just one use case

// * copied from mdn
// @ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let digits = '0123456789'
let symbols = '`~!@#$%^&*()-_=+[]{};:\'",<.>/?\\|'

let options = [alphabet, digits, symbols]

function makePattern () {
  let patternSize = getRandomInt(16)
  let pattern = ''

  for (let i = 0; i < patternSize; i++) {
    let symbolSet = options[getRandomInt(3)]
    pattern += symbolSet[getRandomInt(symbolSet.length)]
  }

  return pattern
}

let idxOf = new Map()

function makeSymbols (pattern) {
  let distinct = new Set(pattern)
  let symbols = []

  let cnt = 0
  distinct.forEach((symbol) => {
    let symbolSet = options[getRandomInt(3)]
    let left = getRandomInt(symbolSet.length - 1)
    let right = getRandomInt(symbolSet.length - left) + left + 1

    symbols.push(symbolSet.slice(left, right))
    idxOf.set(symbol, cnt++)
  })

  return symbols
}

let randomPattern = makePattern()
let randomSymbols = makeSymbols(randomPattern)

let mbn = new MBN(randomPattern, randomSymbols)

tap.equal(randomPattern.length, mbn.pattern.length)
tap.equal(Array.from(randomPattern).reduce((acc, cur, i) => {
  return acc * randomSymbols[idxOf.get(cur)].length
}, 1), mbn.combinations)

mbn.symbols.forEach((symbolArray, idx) => {
  let symbols = symbolArray.get('symbols')
  let circle = symbolArray.get('circle')
  let next = symbolArray.get('next')
  let symbolToIdx = symbolArray.get('symbolToIdx')
  let idxToSymbol = symbolArray.get('idxToSymbol')

  tap.equal(symbols.length, randomSymbols[idx].length)

  let _loop = symbols[0]
  for (let i = 0; i < symbols.length; i++) {
    tap.equal(circle.get(_loop), next(_loop))
    tap.equal(symbolToIdx.get(_loop), i)
    tap.equal(idxToSymbol.get(i), _loop)
    
    _loop = next(_loop)
  }
  tap.equal(_loop, symbols[0])
})
