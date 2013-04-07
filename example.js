function recentFilesThatExist_jsx(){
  return app.recentFiles.map(File).filter(function(file){return file.exists})
}
require('./').invoke(recentFilesThatExist_jsx, function(error, recentFiles){
  console.log("recent files that exist")
  console.log(recentFiles)
})

////////////////////////////////////////////////////////////////////////////////

var photoshop = require('./')
photoshop.debug = true
photoshop.invoke(function(){return app}, function(error, app){
  console.log(app)
})

////////////////////////////////////////////////////////////////////////////////

function setColor_jsx(color){
  app.foregroundColor.rgb.red = color.red
  app.foregroundColor.rgb.green = color.green
  app.foregroundColor.rgb.blue = color.blue
  return app.foregroundColor.rgb.hexValue
}

var config = {
  red: Math.random() * 255,
  green: Math.random() * 255,
  blue: Math.random() * 255
}

require('./').invoke(setColor_jsx, [config], function(error, foregroundColor){
  console.log('#' + foregroundColor)
})
