var http = require('http');
var ecstatic = require('ecstatic');

var port = 8081;

http.createServer(
    ecstatic({
        root: __dirname
    })
).listen(port);

console.log('http://localhost:' + port + '/demo');