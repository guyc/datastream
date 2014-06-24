var http = require('http');
var url = require('url')
var querystring = require('querystring');

exports.listen = function(port, dataConnection, wsServer) {

    var server = http.createServer(function(request, response) {

	console.log(request.url);
	var parsedUrl=url.parse(request.url, true);
	var path = parsedUrl.path.split('/');

	data = '';
	request.on("data", function(chunk) {
            data += chunk;
	});

	request.on("end", function() {
            var args = querystring.parse(data);
	    
            switch (request.method) {
            case 'GET':
		var namespace = path[1];
		var name = path[2];
		console.log({namespace:namespace, name:name});
		get(namespace, name, response);
		break;
            case 'PUT':
		var namespace = path[1];
		console.log({namespace:namespace, args:args});
		put(namespace, args, response);
            }
	});
	
    }).listen(port);

    function get(namespace, name, response)
    {
	dataConnection.get(namespace, name, function(err, value) {
	    if (err === null) {
		var data = {};
		data[name] = value;
		response.writeHead(200);
		console.log(JSON.stringify(data));
		response.write(JSON.stringify(data));
		response.end();
            }
	});
    }
    
    function put(namespace, args, response)
    {
	for (var name in args) {
            value = args[name];
            console.log({namespace:namespace, name:name, value:value});
	    dataConnection.set(namespace, name, value);
	    wsServer.notify(namespace,name,value);
	}
	response.writeHead(200);
	response.end();
    }
}

