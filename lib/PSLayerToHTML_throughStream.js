exports = module.exports = function(config){
  return new PSLayerToHTMLThroughStream(config)
}

function PSLayerToHTMLThroughStream(config){
  this.config = config || {}
  this.readable = true
  this.writable = true
}

require('util').inherits(PSLayerToHTMLThroughStream, require('stream'))

PSLayerToHTMLThroughStream.prototype.write = function(layer){
  this.emit('data', this.convertLayer(layer))
}

PSLayerToHTMLThroughStream.prototype.end = function(layer){
  if (layer) this.write(layer);
  this.emit('end')
}

PSLayerToHTMLThroughStream.prototype.convertRootLayer = function(root){
  return '<!doctype html><meta charset=utf-8><title>' + root._namePath + '</title>'
}

PSLayerToHTMLThroughStream.prototype.convertGroupLayer = function(group){
  return ''
}

PSLayerToHTMLThroughStream.prototype.convertLayer = function(layer){
  if (layer.layerID === -1) return this.convertRootLayer(layer);
  if (layer._childCount > 0) return this.convertGroupLayer(layer);
  
  var html = '<img'
  
  html += ' id=' + layer.layerID
  html += ' name="' + layer.name + '"'
  html += ' width="' + layer.bounds.width + '"'
  html += ' height="' + layer.bounds.height + '"'
  html += ' style="position:absolute; left:' + layer.bounds.left + 'px; top:' + layer.bounds.top + 'px; z-index:' + layer.itemIndex + '"'
  if (layer.parsedMetadata && layer.parsedMetadata.source){
    html += ' src="' + layer.parsedMetadata.source + '"'
  }
  else if (this.config.psd){
    html += ' src="?component=PSLayerImage&psd=' + encodeURIComponent(this.config.psd) + '&id=' + layer.layerID + '&name=' + encodeURIComponent(layer.name) + '"'
  }
  
  html += ' />\n'
  return html
}

if (!module.parent) require('../test/test-PSLayerToHTML')
