const nullParser = (input) => {
  let nullValue = input.slice(0, 4)
  if (nullValue === 'null') {
    input = input.slice(4, input.length)
    return [null, input]
  } else return null
}

const boolParser = (input) => {
  if (input[0] === 't') {
    let boolValue = input.slice(0, 4)
    if (boolValue === 'true') {
      input = input.slice(4, input.length)
      return [true, input]
    } else {
      return null
    }
  } else if (input[0] === 'f') {
    let boolValue = input.slice(0, 5)
    if (boolValue === 'false') {
      input = input.slice(5, input.length)
      return [false, input]
    } else {
      return null
    }
  } else return null
}

const numParser = (input) => {
  let prev = ''
  let outputNum = ''
  if (prev === '') {
    if (input[0] === '-' || (input[0] > 0 && input[0] <= 9)) {
      prev = input[0]
      outputNum += prev
      let i = 1
      while ((input[i] >= 0 && input[i] <= 9 || input[i] === 'e' ||
    input[i] === 'E' || input[i] === '.') && i < input.length) {
        prev = input[i]
        outputNum += input[i]
        i++
      }
      if (prev === 'e' || prev === 'E') {
        while ((input[i] >= 0 && input[i] <= 9 || input[i] === '-' ||
        input[i] === '+') && i < input.length) {
          prev = input[i]
          outputNum += input[i]
          i++
        }
      }

      return [Number(outputNum), input.slice(i, str.length)]
    } else {
      return null
    }
  }
}

const strParser = (input) => {
  let outputStr = ''
  if (input[0] === '"') {
    let prev = input[0]
    let i = 1
    while (input[i] !== '"' && input[i] !== '\\' && i < input.length - 1) {
      prev = input[i]
      outputStr += input[i]
      i++
    }
    prev = input[i]
    if (prev === '\\') {
      let i = 1
      while ((input[i] === '"' || input[i] === '\\' || input[i] === '/' ||
      input[i] === 'b' || input[i] === 'f' || input[i] === 'n' ||
      input[i] === 'r' || input[i] === 't') &&
       i < input.length - 1) {
        prev = input[i]
        outputStr += input[i]
        i++
      }
    }
    prev = input[i]
    if (prev === 'u') {
      let i = 1
      while ((input[i] >= 'A' || input[i] <= 'F' || input[i] >= 0 ||
      input[i] <= 9) &&
       i < input.length - 1) {
        prev = input[i]
        outputStr += input[i]
        i++
      }
    }
    return [outputStr, input.slice(i + 1, str.length)]
  } else return null
}

const commaparser = (input) => {
  if (input[0] === ',') {
    return [input[0], input.slice(1)]
  } else {
    return null
  }
}

const whiteSpaceParser = (input) => {
  if (input[0] === ' ') {
    return [input[0], input.slice(1)]
  } else {
    return null
  }
}

const arrParser = (input) => {
  let inpLength = input.length
  if (input[0] === '[' && inpLength > 1) {
    let i = 1
    let prev
    let outputArr = []
    let result
    input = input.slice(1)
    console.log(input)
    while (input[0] !== ']' && result !== null) {
      console.log('Previous value: ', prev)
      console.log('Current input: ', input)
      result = valueParser(input)
      if (result === null) {
        return null
      } else if (result[0] !== ',' && result[0] !== ' ') {
        prev = result[0]
        outputArr.push(result[0])
      } else {
        if (prev !== ',') {
          prev = ','
        } else {
          return null
        }
      }

      console.log(result)
      input = result[1]
      inpLength = input.length
    }
    if (result === null) {
      return null
    } else if (input[0] === ']') {
      if (prev === ',') {
        return null
      } else {
        return [outputArr, input.slice(i)]
      }
    }
  } else return null
}

const objParser = (input) => {
  if (input[0] === '{' && input[input.length - 1] === '}') {
    return true
  } else return null
}

const valueParser = (input) => {
  return nullParser(input) || boolParser(input) ||
  numParser(input) || strParser(input) ||
  arrParser(input) || objParser(input) ||
  commaparser(input) || whiteSpaceParser(input)
}

var str = '[[1],[2],["ramya"]]'
str = valueParser(str)
console.log(str)
