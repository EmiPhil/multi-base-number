# multi-base-number

## What

Small class to build a number system based on a `pattern` and some `symbols`. There is no requirement for a pattern to have numbers of the same base, which makes it neat for interpreting identifiers as an ordered system. As long as you can describe your string with a consistent pattern, you could use this library to treat that string as a multi base number.

The core library is short and only provides the very basics of a number system. Things like pattern enforcement are not implemented (but could be via extending the class to suit your use case).


## Usage

Can be used to poorly reinvent the wheel:

```js
const MBN = require('mbn')

let pattern = 'bbbb'
let symbols = ['01']

let nibble = new MBN(pattern, symbols)

console.log(nibble.toMbn(14))           // '1110'
console.log(nibble.toBase10('1110'))    // 14
console.log(nibble.add('1010', '0101')) // '1111'
```

Numbers are cyclical:

```js
let one = '0001'

let current = '0000'
let results = []
for (let i = 0; i <= 16; i++) {
  results.push(current)
  current = nibble.add(current, one)
}

console.log(results)
/*
[
  '0000', '0001',
  '0010', '0011',
  '0100', '0101',
  '0110', '0111',
  '1000', '1001',
  '1010', '1011',
  '1100', '1101',
  '1110', '1111',
  '0000'
]
*/

console.log(nibble.toMbn(15)) // '1111'
console.log(nibble.toMbn(16)) // '0000'
console.log(nibble.toMbn(31)) // '1111'
console.log(nibble.toMbn(32)) // '0000'
```

Paterns do not need to use the same base:

```js
const MBN = require('mbn')

let pattern = 'LL-NN-LL'
// each unique pattern token is expected to have a corresponsing symbol array

let symbols = [
  'ABCDEF',  // the symbol array should specify its values in ascending order. A = 0
  '-',       // the symbol array is expected to be in the same order as the pattern
  '1234'     // the symbol array can have mixes characters
]

let myNumber = new MBN(pattern, symbols)

console.log(myNumber.combinations)                 // 6 * 6 * 1 * 4 * 4 * 1 * 6 * 6 = 20,736
console.log(myNumber.minId)                        // AA-11-AA
console.log(myNumber.maxId)                        // FF-44-FF

console.log(myNumber.toMbn(0))                     // AA-11-AA
console.log(myNumber.toBase10('AA-11-AA'))         // 0

console.log(myNumber.toMbn(20736 - 1))             // FF-44-FF
console.log(myNumber.toBase10('FF-44-FF'))         // 20,735

console.log(myNumber.toBase10('CA-24-AB'))         // 7,165
console.log(myNumber.toBase10('DD-41-DF'))         // 12,551

console.log(7165 + 12551)                          // 19,716
console.log(myNumber.add('CA-24-AB', 'DD-41-DF'))  // FE-14-EA
console.log(myNumber.toBase10('FE-14-EA'))         // 19,716
```
