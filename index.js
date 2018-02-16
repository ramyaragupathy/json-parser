const fs = require('fs')
const parser = require('./src/parser.js')
const fileName = process.argv[2]
const message = ['INVALID JSON']
const fileContents = fs.readFileSync(fileName, 'utf8')

let jsonStr = String.raw`${fileContents}`

jsonStr = parser(jsonStr)
if (jsonStr === null) {
  console.log(message[0])
} else if (jsonStr[1] !== '') {
  jsonStr[1] = jsonStr[1].trim()
  if (jsonStr[1] !== '') {
    console.log(message[0], jsonStr[1])
  } else {
    console.log(jsonStr[0])
  }
} else if (jsonStr[1] === '') {
  console.log(jsonStr[0])
}
