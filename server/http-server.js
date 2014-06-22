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
	dataConnection.query('SELECT * FROM `data` WHERE `namespace`=? AND `name`=? LIMIT 1', [namespace, name], function(err, results) {
            console.log(results);
            console.log(err);
            if (err === null) {
		// no error
		var data = {};
		console.log({results:results, len:results.length});
		if (results.length > 0) {
                    data[name]=results[0].value;
		} else {
                    console.log('nothing');
		}
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
            dataConnection.query('UPDATE `data` SET value=? WHERE `namespace`=? AND `name`=?',[value,namespace,name], function(err, results) {
		console.log({results:results,err:err});
		if (results.affectedRows == 0) {
                    dataConnection.query('INSERT INTO `data` SET `namespace`=?, `name`=?, `value`=?',[namespace,name,value], function(err, results) {
			console.log({results:results,err:err});
                    });
		}
		wsServer.notify(namespace,name,value);
            });
	}
	response.writeHead(200);
	response.end();
    }
}

