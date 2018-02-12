const nullParser = (input) => {
  let nullValue = input.slice(0, 4)
  if (nullValue === 'null') {
    str = input.slice(4, input.length)
    return [nullValue, str]
  } else return null
}

const boolParser = (input) => {
  if (input[0] === 't') {
    let boolValue = input.slice(0, 4)
    if (boolValue === 'true') {
      str = input.slice(4, input.length)
      return [true, str]
    } else {
      return null
    }
  } else if (input[0] === 'f') {
    let boolValue = input.slice(0, 5)
    if (boolValue === 'false') {
      str = input.slice(5, input.length)
      return [false, str]
    } else {
      return null
    }
  } else return null
}

const numParser = (inputStr) => {
  if (prev === '') {
    if (inputStr[0] === '-' || (inputStr[0] > 0 && inputStr[0] <= 9)) {
      prev = inputStr[0]
      outputStr += prev
      let i = 1
      while ((inputStr[i] >= 0 && inputStr[i] <= 9 || inputStr[i] === 'e' ||
    inputStr[i] === 'E' || inputStr[i] === '.') && i < inputStr.length) {
        prev = inputStr[i]
        outputStr += inputStr[i]
        i++
      }
      if (prev === 'e' || prev === 'E') {
        while ((inputStr[i] >= 0 && inputStr[i] <= 9 || inputStr[i] === '-' ||
        inputStr[i] === '+') && i < inputStr.length) {
          prev = inputStr[i]
          outputStr += inputStr[i]
          i++
        }
      } 
    
      return [Number(outputStr), str.slice(i, str.length)]
    } else {
      return null
    }
  }
}

const strParser = (inputStr) => {
  if (inputStr[0] === '"' && inputStr[inputStr.length - 1] === '"') {
    prev = inputStr[0]
    let i = 1
    while (inputStr[i] !== '"' && inputStr[i] !== '\\' && i < inputStr.length-1) {
      prev = inputStr[i]
      outputStr += inputStr[i]
      i++
    }
    prev = inputStr[i]
    if (prev === '\\'){
      let i = 1
      while ((inputStr[i] === '"' || inputStr[i] === '\\' || inputStr[i] === '/' ||
      inputStr[i] === 'b' || inputStr[i] === 'f' || inputStr[i] === 'n' ||
      inputStr[i] === 'r' || inputStr[i] === 't')
       && i < inputStr.length-1) {
        prev = inputStr[i]
        outputStr += inputStr[i]
        i++
      }
    }
    prev = inputStr[i]
    if (prev === 'u'){
      let i = 1
      while ((inputStr[i] >= 'A' || inputStr[i] <= 'F' || inputStr[i] >= 0 ||
      inputStr[i] <= 9)
       && i < inputStr.length-1) {
        prev = inputStr[i]
        outputStr += inputStr[i]
        i++
      }
    }
    return [outputStr, str.slice(i, str.length)]
  } else return null
}

const arrParser = (inputStr) => {
  if (inputStr[0] === '[' && inputStr[inputStr.length - 1] === ']'){
   return true
  } else return null
}

const objParser = (inputStr) => {
  if (inputStr[0] === '{' && inputStr[inputStr.length - 1] === '}'){
   return true
  } else return null
}

const valueParser = (inputStr) => {
  return nullParser(inputStr) || boolParser(inputStr) ||
  numParser(inputStr) || strParser(inputStr) ||
  arrParser(inputStr) || objParser(inputStr)
}

var str = '1.7e2abc'
var prev = ''
var outputStr = ''

str = valueParser(str)

console.log(outputStr)
console.log(str)
