# json-parser

## development
`git clone git@github.com:ramyaragupathy/json-parser.git`
`npm install`

## usage

`json-rdparse <filepath>`

### What is JSON?
 JSON (JavaScript Object Notation) is a way to pack an object into a string, so that it can be transferred somewhere & later unpacked into an object. It is _**textual, language-independent, data exchange format**_ similar to CSV, XML, YAML,etc.

 JSON got its origin based on how Javascript object works. However it is not limited to just Javascript. It is used in other languages as well.

 The process of converting an _object into a string (byte format)_ is called _**serialisation/marshalling**_.

 The process of converting a _string into object_ or extracting data structure from a series of bytes is called _**deserialisation/unmarshalling**_.

### What is a Javascript Object?

_[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)_

### Why do we need a data exchange format?
Objects in different programming languages are represented/strucutred differently. What is valid in Javascript might not be recognisable in C++/Java because they represent objects differently. A data exchange format like JSON enables structured information transfer between programming languages.


### Difference between JSON & JS Object

_[From stackoverflow](https://stackoverflow.com/questions/8294088/javascript-object-vs-json)_

### Test Scenarios

Here I'm listing a few scenarios based on RFC 7159 standard. Online validators gives results based on the standard adapted in their websites. Most recent specifiation is RFC 8259 released in December 2017.

#### Valid
Valid | Invalid
------|--------
 0 |01
[]| [
{} | }
""|''
[1,2,3], [1,]
["1", "2", 3]|['1','2', '3']
"abc" | "abc
"abc\""|"abc\"
"abc\u0123"|"abc\u012"
{"a":"b"}|{'a':'b'}
{"a":8}|{a:8}
{"a":{"b":{"c":"d"}}}




