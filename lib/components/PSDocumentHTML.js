var photoshop = require('../..')
var PSDocumentData = require('./PSDocumentData')
var JSONStream = require('JSONStream')
var PSLayerToHTML = require('../PSLayerToHTML_throughStream')


exports = module.exports = function render(config){
  return PSDocumentData(config)
    .pipe(JSONStream.parse())
    .pipe(PSLayerToHTML({ psd:config.psd }))
}

if (!module.parent) require('../../test/test-PSDocumentHTML');
