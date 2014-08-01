require('./aftereffects').createStream(function jsx(stream, props){
  stream.writeln(JSON.stringify(props))
  alert("After Effects won't return until this window is closed, but the stream already sent its data!")
}, [{lulz:true}])
.pipe(process.stdout)
