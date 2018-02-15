
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
    if (input[0] === '-' || (input[0] >= 0 && input[0] <= 9)) {
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
      if (outputNum[0] === '0') {
        if (outputNum[1] >= '0' && outputNum[1] <= '9') {
          return null
        } else {
          if (Number(outputNum) >= 0) {
            return [Number(outputNum), input.slice(i)]
          } else return null
        }
      }
      return [Number(outputNum), input.slice(i)]
    } else {
      return null
    }
  }
}

const strParser = (input) => {
  //console.log('STR PARSER')
  let outputStr = ''
  let inpLength = input.length
  let prev = ''
  // console.log(input)
  if (input[0] === '"') {
    // console.log('input ', input)
    input = input.slice(1)
    let i = 1
    // console.log('Now the first character is ', input[0])
    while (input[0] !== '"' && i < inpLength) {
      // console.log('entered while loop')
      prev = input[0]
      // console.log('prev before further operations : ', prev)
      outputStr += prev
      input = input.slice(1)
      i++
      
      if (prev === '\\') {
        // console.log('encountered a control character')
        outputStr = outputStr.slice(0, -1)
        prev = input[0]
        // console.log('prev after further operations : ', prev)
        
        i++
        let nextChar = (input[0] === '"' || input[0] === '\\' || input[0] === '/' ||
        input[0] === 'b' || input[0] === 'f' || input[0] === 'n' ||
        input[0] === 'r' || input[0] === 't' || input[0] === 'u')
        // console.log(nextChar, input[0])
        if (nextChar === false) {
          return null
        } else if (input[0] === 'u') {
          prev = input[0]
          let numHex = 1
          let hexCode = '0x'
          input = input.slice(1)
          while (((input[0] >= 'A' && input[0] <= 'F') ||
          (input[0] >= 'a' && input[0] <= 'f') || input[0] >= 0 ||
          input[0] <= 9 && input[0] !== '"') && numHex <= 4) {
            // console.log(' reading ' + i + ' th character after \\u ' + input[0])
            prev = input[0]
            input = input.slice(1)
            numHex++
            hexCode += prev
          }

          prev = input[0]
          if (numHex === 5) {
            outputStr += String.fromCharCode(hexCode)

            continue
          } else {
            return null
          }
        } else {
          // console.log('escape character found ')
          // outputStr += prev
          // console.log(input[0])
          prev = input[0]
          outputStr += prev
          input = input.slice(1)
        }
      } // end of control char check
    } // end of while
    prev = input[0]

    if (prev === '"') {
      return [outputStr, input.slice(1)]
    } else return null
  } else return null
}

const commaParser = (input) => {
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

const specialCharParser = (input) => {
  if (input[0] === '\n' || input[0] === '\t' || input[0] === '\b' ||
  input[0] === '\f' || input[0] === '\r') {
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
    // console.log(input)
    while (input[0] !== ']' && result !== null) {
      while (whiteSpaceParser(input) !== null || specialCharParser(input) !== null) {
        input = input.slice(1)
      }
      if (input[0] === ']') {
        return [outputArr, input.slice(1)]
      }
      result = valueParser(input) || commaParser(input)
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
const colonParser = (input) => {
  if (input[0] === ':') {
    return [input[0], input.slice(1)]
  } else {
    return null
  }
}
const objParser = (input) => {
  // console.log('OBJ PARSER')
  if (input[0] === '{') {
    // console.log('Testing for ', input)
    let outputStr = {}
    input = input.slice(1)
    let result

    while (input[0] !== '}' && result !== null) {
      // console.log('input is ', input)
      while (whiteSpaceParser(input) !== null || specialCharParser(input) !== null) {
        input = input.slice(1)
      }
      result = strParser(input)

      if (result !== null) {
        input = result[1]
        let key = result[0]
        // console.log('key is ', key)
        outputStr[result[0]] = undefined
        let separator, colonEncountered
        while (separator !== null) {
          separator = colonParser(input) || whiteSpaceParser(input)
          if (separator !== null) {
            if (separator[0] === ':') {
              colonEncountered = separator[0]
            }

            input = separator[1]
            // console.log('still inside separator', separator)
            // console.log('input after consuming separator ' + separator[0] + 'is ' + input)
          }
        }
        if (!colonEncountered) {
          return null
        }
        result = valueParser(input)

        if (result !== null) {
          // console.log('value is ', result[0])
          // console.log('Result retruned', result)
          outputStr[key] = result[0]
          input = result[1]
          let whitespace
          while (whitespace !== null) {
            // console.log('Checking for whitespace')
            whitespace = whiteSpaceParser(input) || specialCharParser(input)
            if (whitespace !== null) {
              input = input.slice(1)
            }

            // console.log(input)
          }

          separator = commaParser(input) || input[0] === '}'
          // console.log('Expecting comma. Found ', separator)
          if (separator === null || separator === false) {
            // console.log('separtor err', outputStr)
            return null
          } else {
            if (separator === true) {
              // console.log('current set: ', outputStr)
              return [outputStr, input.slice(1)]
            } else {
              input = separator[1]
              // console.log('next iteration starts with ', input)
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
    // console.log('End of object encountered', outputStr)
    return [outputStr, input.slice(1)]
  } else return null
}

const valueParser = (input) => {
  return nullParser(input) || boolParser(input) ||
  numParser(input) || strParser(input) ||
  arrParser(input) || objParser(input)
}

module.exports = valueParser
