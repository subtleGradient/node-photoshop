var photoshop = require('../..')
var PSDocumentData = require('./PSDocumentData')
var JSONStream = require('JSONStream')
var PSLayerToCSS = require('../PSLayerToCSS_throughStream')


exports = module.exports = function render(config){
  return PSDocumentData(config)
    .pipe(JSONStream.parse())
    .pipe(PSLayerToCSS({ psd:config.psd }))
}

if (!module.parent) require('../../test/test-PSDocumentCSS');
