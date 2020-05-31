class MBN {
  constructor (pattern, symbols) {
    this.locale = 'en-US'

    this.pattern = pattern
    this.patternArray = Array.from(pattern)

    this.symbols = symbols.map((symbolDefinition) => {
      let cache = new Map()
      let circle = new Map()
      let symbolToIdx = new Map()
      let idxToSymbol = new Map()

      Array.from(symbolDefinition).forEach((symbol, i, arr) => {
        circle.set(symbol, i + 1 === arr.length ? arr[0] : arr[i + 1])
        symbolToIdx.set(symbol, i)
        idxToSymbol.set(i, symbol)
      })

      cache.set('symbols', symbolDefinition)
      cache.set('circle', circle)
      cache.set('next', (mbn) => circle.get(mbn))
      cache.set('symbolToIdx', symbolToIdx)
      cache.set('idxToSymbol', idxToSymbol)

      cache.set('min', symbolDefinition[0])
      cache.set('max', symbolDefinition[symbolDefinition.length - 1])

      return cache
    })

    this.symbolIdxMap = new Map()
    this.posToSymbol = new Map()
    let patternIdx = 0
    this.patternArray.forEach((symbol, pos) => {
      this.posToSymbol.set(pos, symbol)

      if (this.symbolIdxMap.has(symbol)) {
        return
      }

      this.symbolIdxMap.set(symbol, patternIdx)
      patternIdx++
    })

    this.patternCombinations = []
    this.minId = ''
    this.maxId = ''
    this.patternArray.forEach((symbol) => {
      let symbolIdx = this.symbolIdxMap.get(symbol)
      let s = symbols[symbolIdx]

      this.patternCombinations.push(s.length)
      this.minId += s[0]
      this.maxId += s[s.length - 1]
    })
    this.combinations = this.patternCombinations.reduce((acc, cur) => acc * cur, 1)

    this.symbolsAt = this.symbolsAt.bind(this)
    this.increment = this.increment.bind(this)
  }

  parseBreakpoints () {
    this.cacheBreakPoints = this.patternCombinations.map((_, i, arr) => {
      if (i === arr.length - 1) {
        return 1
      }

      return arr.slice(i + 1).reduce((acc, cur) => acc * cur, 1)
    })

    return this.breakPoints
  }

  get breakPoints () {
    if (this.cacheBreakPoints) {
      return this.cacheBreakPoints
    }
    return this.parseBreakpoints()
  }

  parseMod1 () {
    let mod1 = []
    for (let i = 1; i < this.combinations; i++) {
      if (this.combinations % i === 0) {
        mod1.push(i)
      }
    }
    
    this.cacheMod1 = mod1
    return mod1
  }

  get mod1 () {
    if (this.cacheMod1) {
      return this.cacheMod1
    }
    return this.parseMod1()
  }

  symbolsAt (pos) {
    let symbol = this.posToSymbol.get(pos)
    let idx = this.symbolIdxMap.get(symbol)
    return this.symbols[idx]
  }

  toMbn (number) {
    let { symbolsAt, combinations, patternArray, patternCombinations, breakPoints } = this
    let indices = []

    for (let i = 0; i < patternArray.length; i++) {
      let bp = breakPoints[i]
      let j = number

      while (j >= combinations) {
        j -= combinations
      }

      indices[i] = Math.floor(j / bp)
      number -= indices[i] * bp
    }

    return indices.reduce((acc, idx, pos) => acc + symbolsAt(pos).get('idxToSymbol').get(idx), '')
  }

  toBase10 (mbn) {
    let { symbols, symbolsAt, breakPoints } = this

    let numberParts = Array.from(mbn).map((symbol, pos) => {
      return symbolsAt(pos).get('symbolToIdx').get(symbol)
    })

    return numberParts.reduce((acc, cur, pos) => {
      return acc + (cur * breakPoints[pos])
    }, 0)
  }

  isValid (mbn) {
    let isValid = !!(mbn && mbn.length === this.pattern.length)

    if (!isValid) {
      return isValid
    }

    for (let i = 0; i < mbn.length; i++) {
      if (!this.symbolsAt(i).get('symbolToIdx').has(mbn[i])) {
        isValid = false
        break
      }
    }

    return isValid
  }

  increment (mbn, pos) {
    let { symbolsAt } = this
    let result = Array.from(mbn)
    
    let max = mbn.length
    while (max--) {
      let definition = symbolsAt(pos)
      result[pos] = definition.get('next')(result[pos])

      if (pos && definition.get('symbolToIdx').get(result[pos]) === 0) {
        pos--
      } else {
        break
      }
    }

    return result.join('')
  }

  add (mbn, mbn2) {
    let { symbolsAt, increment, pattern } = this
    let result = mbn

    Array.from(mbn2).forEach((symbol, pos) => {
      let definition = symbolsAt(pos)
      let distance = definition.get('symbolToIdx').get(symbol)

      while (distance--) {
        result = increment(result, pos)
      }

    })

    return result
  }

  printBreakpoints () {
    let result = 'Breakpoints:\npos | mult'
    let longestBp
    this.breakPoints.forEach((bp, pos) => {
      let bpString = bp.toLocaleString(this.locale)

      if (pos === 0) {
        longestBp = bpString.length
      } else {
        bpString = bpString.padStart(longestBp)
      }

      result += `${pos.toString().padEnd(3, ' ')} | ${bpString}\n`
    })
    return result
  }

  printSymbolTables () {
    let { patternArray, symbols, symbolIdxMap } = this
    let distinctSymbols = new Set(patternArray)
    
    let result = `Pattern: ${this.pattern}\n`

    distinctSymbols.forEach((symbol) => {
      let symbolString      = 'symbol | '
      let multiplierString  = '  mult | '

      let definition = symbols[symbolIdxMap.get(symbol)].get('symbols')
      Array.from(definition).forEach((_symbol, mult) => {
        mult += ' '
        _symbol = _symbol.toString().padEnd(mult.length, ' ')

        symbolString += _symbol
        multiplierString += mult
      })

      result += `Symbol ${symbol} multiplication table:
      ${symbolString}
      ${multiplierString}
      `
    })

    return result
  }

  printTables () {
    return this.printBreakpoints() + this.printSymbolTables()
  }

}

module.exports = MBN
