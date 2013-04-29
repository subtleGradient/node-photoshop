exports = module.exports = function(config){
  return new PSLayerToCSSThroughStream(config)
}

function PSLayerToCSSThroughStream(config){
  this.config = config || {}
  this.readable = true
  this.writable = true
}

require('util').inherits(PSLayerToCSSThroughStream, require('stream'))

PSLayerToCSSThroughStream.prototype.write = function(layer){
  this.emit('data', this.convertLayer(layer))
}

PSLayerToCSSThroughStream.prototype.end = function(layer){
  if (layer) this.write(layer);
  this.emit('end')
}

PSLayerToCSSThroughStream.prototype.convertRootLayer = function(root){
  return ''
}

PSLayerToCSSThroughStream.prototype.convertGroupLayer = function(group){
  return ''
}

PSLayerToCSSThroughStream.prototype.convertLayer = function(layer){
  if (layer.layerID === -1) return this.convertRootLayer(layer);
  if (layer._childCount > 0) return this.convertGroupLayer(layer);
  
  var css = ''
  
  css += '#layer' + layer.layerID
  css += '{'
  css += 'width:' + layer.bounds.width + 'px; '
  css += 'height:' + layer.bounds.height + 'px; '
  css += 'background-size: 100% 100%; '
  css += 'position: absolute; '
  css += 'left:' + layer.bounds.left + 'px; '
  css += 'top:' + layer.bounds.top + 'px; '
  css += 'z-index:' + layer.itemIndex + '; '
  if (layer.parsedMetadata && layer.parsedMetadata.source){
    css += 'background: url("' + layer.parsedMetadata.source + '")'
  }
  else if (this.config.psd){
    css += 'background: url("?component=PSLayerImage&psd=' + encodeURIComponent(this.config.psd) + '&id=' + layer.layerID + '&name=' + encodeURIComponent(layer.name) + '")'
  }
  
  css += '}\n'
  return css
}

if (!module.parent) require('../test/test-PSLayerToCSS')
