var Parser = require('node-expat').Parser

module.exports = function (stream, callback) {
  var data = {}
  var currentElement = null
  var currentIndication = null
  var parser = new Parser('UTF-8')
    .on('error', function () {
      console.error('got')
      console.error(error)
    })
    .on('startElement', function (name, attributes) {
      currentElement = name
      if (name === 'sref') {
        if (data[currentIndication]) {
          data[currentIndication].push(attributes.ref)
        } else {
          data[currentIndication] = [attributes.ref]
        }
      }
    })
    .on('text', function (text) {
      if (currentElement === 'CWIndication') {
        if (text.trim().length !== 0) {
          currentIndication = text
        }
      }
    })
    .once('end', function () {
      callback(null, data)
    })
  stream.pipe(parser)
}
