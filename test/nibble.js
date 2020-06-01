const tap = require('tap')
const MBN = require('../mbn')

tap.pass('Test suite loaded')

const nibble = new MBN('dddd', ['01'])

tap.strictSame(nibble.pattern, 'dddd')
tap.strictSame(nibble.patternArray, ['d', 'd', 'd', 'd'])
tap.strictSame(nibble.locale, 'en-US')
tap.strictSame(nibble.patternCombinations, [2, 2, 2, 2])
tap.strictSame(nibble.minId, '0000')
tap.strictSame(nibble.maxId, '1111')

// * pre vs post cache
let originalBp = nibble.breakPoints
let originalM1 = nibble.mod1

tap.strictSame(nibble.breakPoints, nibble.cacheBreakPoints)
tap.strictSame(nibble.breakPoints, originalBp)

tap.strictSame(nibble.mod1, nibble.cacheMod1)
tap.strictSame(nibble.mod1, originalM1)

tap.strictSame(nibble.mod1, [3, 5, 15])

let nibbles = [
  '0000', '0001',
  '0010', '0011',
  '0100', '0101',
  '0110', '0111',
  '1000', '1001',
  '1010', '1011',
  '1100', '1101',
  '1110', '1111'
]

nibbles.forEach((n) => {
  tap.equal(nibble.isValid(n), true)
})

tap.equal(nibble.isValid('10101'), false)
tap.equal(nibble.isValid('6010'),  false)
tap.equal(nibble.isValid(null),    false)
tap.equal(nibble.isValid('10'),    false)

tap.equal(nibble.combinations, nibbles.length)

function bitwiseAdd (a, b) {
  return (parseInt(a, 2) + parseInt(b, 2)) & 15
}

for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 16; j++) {
    let a = nibbles[i]
    let b = nibbles[j]

    tap.equal(nibble.toMbn(parseInt(a, 2)), a)
    tap.equal(nibble.toMbn(parseInt(b, 2)), b)

    let expected = bitwiseAdd(a, b)

    tap.equal(parseInt(nibble.add(a, b), 2), expected)
    tap.equal(nibble.toBase10(nibble.add(a, b)), expected)

    tap.equal(parseInt(nibble.toMbn(i + j), 2), (i + j) & 15)
    tap.equal(parseInt(nibble.toMbn(i * j), 2), (i * j) & 15)

    tap.equal(nibble.toMbn(i + j), nibble.add(a, b))
  }
}
