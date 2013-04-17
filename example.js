function recentFilesThatExist_jsx(){
  return app.recentFiles.map(File).filter(function(file){return file.exists})
}
require('./').invoke(recentFilesThatExist_jsx, function(error, recentFiles){
  console.log("recent files that exist")
  console.log(recentFiles)
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

////////////////////////////////////////////////////////////////////////////////

function streamColorChanges_jsx(stream, setColor_jsx, config){
  stream.writeln(setColor_jsx(config))
  alert("Photoshop won't return until this window is closed, but the stream already sent its data!")
}

require('./').createStream(streamColorChanges_jsx, [setColor_jsx, config])
.pipe(process.stdout)
