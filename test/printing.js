const tap = require('tap')
const MBN = require('../mbn')

// * we don't test what the printing functions output cause it is a side effect. Instead we make
// * sure that the printTables function prints all of the tables, whatever their output may be

const nibble = new MBN('dddd', ['01'])


let a = nibble.printBreakpoints()
let b = nibble.printSymbolTables()

let c = nibble.printTables()

tap.equal(c, a + b)
