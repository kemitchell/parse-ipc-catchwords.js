var Parser = require('node-expat').Parser
var pump = require('pump')

module.exports = function (xmlStream, callback) {
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
  pump(xmlStream, parser, function (error) {
    if (error) {
      callback(error)
    } else {
      callback(null, data)
    }
  })
}
