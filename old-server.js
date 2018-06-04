var http = require('http');
var fs = require('fs');


var server = http.createServer(function(request, response){
	if(request.url === '/image'){
		if(request.method === 'GET'){
			var image = fs.readFileSync('./images/IMG_0351.jpg');
			response.writeHead(200, {"Content-type": "image/jpeg"});
			response.end(image, 'binary');
		}
	}
});

server.listen(3001, function(){
	console.log('server started');
});