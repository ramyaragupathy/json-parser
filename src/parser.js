#!/usr/bin/env node
const nullParser = (input) => {return input.startsWith('null') ? [null, input.slice(4, input.length)]: null}
const boolParser = (input) => {
  return input.startsWith('true')?[true, input.slice(4, input.length)]:
  (input.startsWith('false'))?[false, input.slice(5, input.length)]:null
}
const digitParser = (input) => {return (input >=0 && input <= 9) ? input:null}
const expParser = (input) => {return (input === 'E' || input === 'e') ? input:null}
const signParser = (input) => {return (input === '+' || input === '-') ? input:null}
const next = (arr, input) => {
 arr[0] = input[arr[2]]
 arr[1] += input[arr[2]]
 arr[2]++
 return arr
}
const numParser = (input) => {
  let arr = ['', '', 0]
  if (signParser(input[arr[2]]) === '-' || digitParser(input[arr[2]])) {
    next(arr, input)
    while ((digitParser(input[arr[2]]) || expParser(input[arr[2]]) || input[arr[2]] === '.')) {
      next(arr,input)
      if (expParser(input[arr[2]])) {
        next(arr,input) 
        while ((digitParser(input[arr[2]]) || signParser(input[arr[2]]))) {
          next(arr, input)}
        if (input[arr[2]] === '.') return null     
      }
    } 
    return arr[1][0] === '0'? (arr[1].length === 1?[Number(arr[1]),input.slice(arr[2])]: 
           (arr[1][1] === '.' || expParser(arr[1][1])?[Number(arr[1]),input.slice(arr[2])]:null))
                                  : (Number(arr[1])?[Number(arr[1]), input.slice(arr[2])]:null)
} else return null}

const strParser = (input) => {
  let inpLength = input.length
  let arr = ['','',0]
  if (input[arr[2]] === '"') {
      next(arr, input)
      while(input[arr[2]] !== '"' && arr[2] < inpLength){
        if (input[arr[2]] === '\\') {
          next(arr, input)
          if (!specialChars(input[arr[2]])) {return null} 
          else if (input[arr[2]] === 'u') {
            let numHex = 1, hexCode = '0x'
            next(arr, input)
            while (hexChars(input[arr[2]]) && numHex<=4) {
              numHex++
              hexCode += input[arr[2]]
              next(arr, input)
            }
            if (numHex === 5) {
              arr[1] = arr[1].slice(0,-6)
              arr[1] += String.fromCharCode(hexCode)
            } else return null   
          } else if(input[arr[2]] === '"' || input[arr[2]] === '\\'){
             arr[1] = arr[1].slice(0,-1)
          } 
        } 
        next(arr, input)
      }
    return (input[arr[2]] === '"') ?[arr[1].slice(1), input.slice(arr[2]+1)]:null
  } else return null
}

const hexChars = (input) => {return ((input >= 'A' && input <= 'F') || (input >= 'a' && input <= 'f') || digitParser(input))? input : null}
const specialChars = (input) => {return (input === '"' || input === '\\' || input === '/' || input === 'b' || input === 'f' || input === 'n' ||input === 'r' || input === 't' || input === 'u') ? input : null}
const commaParser = (input) => {return (input[0] === ',') ?[input[0], input.slice(1)] :null}
const whiteSpaceParser = (input) => {return (input[0] === ' ') ? [input[0], input.slice(1)] : null}
const specialCharParser = (input) => {
  return (input[0] === '\n' || input[0] === '\t' || input[0] === '\b' ||
  input[0] === '\f' || input[0] === '\r')?[input[0], input.slice(1)]:null
}

const arrParser = (input) => {
  let inpLength = input.length
  if (input[0] === '[' && inpLength > 1) {
    let i = 1, prev, outputArr = [],result
    input = input.slice(1)
    while (input[0] !== ']' && result !== null) {
      while (whiteSpaceParser(input)|| specialCharParser(input)) {
        input = input.slice(1)
      }
      if (input[0] === ']') {return [outputArr, input.slice(1)]}
      result = valueParser(input) || commaParser(input)
      if (result === null) {
        return null
      } else if (result[0] !== ',' && result[0] !== ' ') {
        prev = result[0]
        outputArr.push(result[0])
      } else {
        if (prev !== ',') {
          prev = ','
        } else return null  
      }
      input = result[1]
      inpLength = input.length
    }
    if (result === null) {
      return null
    } else if (input[0] === ']') {
      return (prev === ',') ?null:[outputArr, input.slice(i)]
    }
  } else return null
}
const colonParser = (input) => {return (input[0] === ':') ?[input[0], input.slice(1)]:null}
const objParser = (input) => {
  if (input[0] === '{') {
    let outputStr = {}
    input = input.slice(1)
    let result
    while (input[0] !== '}' && result !== null) {
      while (whiteSpaceParser(input) !== null || specialCharParser(input) !== null) {
        input = input.slice(1)
      }
      result = strParser(input)
      if (result !== null) {
        input = result[1]
        let key = result[0]
        outputStr[result[0]] = undefined
        let separator, colonEncountered
        while (separator !== null) {
          separator = colonParser(input) || whiteSpaceParser(input)
          if (separator !== null) {
            if (separator[0] === ':') {
              colonEncountered = separator[0]
            }
            input = separator[1]
          }
        }
        if (!colonEncountered) {return null}
        result = valueParser(input)

        if (result !== null) {
          outputStr[key] = result[0]
          input = result[1]
          let whitespace
          while (whitespace !== null) {
            whitespace = whiteSpaceParser(input) || specialCharParser(input)
            if (whitespace !== null) {
              input = input.slice(1)
            }
          }

          separator = commaParser(input) || input[0] === '}'
          if (separator === null || separator === false) {
            return null
          } else {
            if (separator === true) {
              return [outputStr, input.slice(1)]
            } else {
              input = separator[1]
              continue
            }
          } // comma finder
        } else {
          return null
        } // end of value finder
      } else {
        return null
      } // end of key finder
    } // end of while loop
    return [outputStr, input.slice(1)]
  } else return null
}

const valueParser = (input) => {
  return nullParser(input) || boolParser(input) ||
  numParser(input) || strParser(input) ||
  arrParser(input) || objParser(input)
}

module.exports = valueParser