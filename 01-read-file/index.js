var fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');

var stream = new fs.ReadStream(filePath, {encoding: 'utf-8'});

stream.on('readable', function(){
    var data = stream.read();
    if(data != null)console.log(data);
});
