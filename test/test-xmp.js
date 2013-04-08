var test = require('tap').test

test('layerXMP', function(t){
  var layerXMP = '<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>\n\
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.3-c011 66.145661, 2012/02/06-14:56:27        ">\n\
   <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n\
      <rdf:Description rdf:about=""\n\
            xmlns:json="https://github.com/subtleGradient/node-photoshop-inspector-server">\n\
         <json:source>"/users/aylott/desktop/Untitled-1.psd"</json:source>\n\
      </rdf:Description>\n\
   </rdf:RDF>\n\
</x:xmpmeta>\n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                                                                                                    \n\
                           \n\
<?xpacket end="w"?>'
  
  test('ao_XMP.keys', function(t){
    require('../').invoke('ao_XMP.keys', [layerXMP], function(error, keys){
      t.ok(error == null, 'no error')
      t.is(typeof keys, 'object', 'is an object')
      t.ok(Array.isArray(keys), 'is an Array')
      t.ok(keys.indexOf("json:source") > -1, 'includes "json:source"')
      t.end()
    })
  })

  test('ao_XMP.parse', function(t){
    require('../').invoke('ao_XMP.parse', [layerXMP], function(error, parsed){
      t.ok(error == null, 'no error')
      t.is(typeof parsed, 'object', 'is an object')
      t.ok('source' in parsed, 'has a source key')
      t.equals(parsed.source, "/users/aylott/desktop/Untitled-1.psd")
      t.end()
    })
  })

  t.end()
})
