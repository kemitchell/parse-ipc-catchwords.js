var Parser = require('node-expat').Parser
var pump = require('pump')

module.exports = function (stream, callback) {
  var data = {}
  var currentElement = null
  var currentIndication = null
  var parser = new Parser('UTF-8')
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
  pump(stream, parser, function (error) {
    if (error) {
      console.error(error)
      callback(error)
    } else {
      callback(null, data)
    }
  })
}
