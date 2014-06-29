var clients = {};

exports.listen = function(port, dataConnection) {

    var http = require('http');
    var WebSocketServer = require('websocket').server;

    console.log('ws-server starting on port '+port);

    var httpServer = http.createServer(function(request, response) {});

    httpServer.listen(port, function() {
	console.log((new Date()) + 'Server is listening on port '+port);
    });

    wsServer = new WebSocketServer({httpServer:httpServer});

    wsServer.on('request', function(request) {
	console.log('request received '+request.requestedProtocols);
	console.log({url:request.resourceURL});
	var path = request.resourceURL.path.split('/');
	console.log(path);
	var namespace = path[1];
	var pattern = path[2]; // optional, not fully supported yet
	if (pattern === '' || pattern === undefined) name = '%';  // for now use % syntax, should be not mysql specific.
	console.log(namespace, pattern);
	
	var connection = request.accept('data-stream', request.origin);

	// send initial state of all matching values
	// REVISIT - to ensure state continuity we should be queuing notifications until this completes.
	
	dataConnection.getAll(namespace, pattern, function(err, data)  {
	    if (err === null) {
		connection.sendUTF(JSON.stringify(data));
	    }
	});

	// add new connection to list of clients for this namespace
	if (clients[namespace] == undefined) {
	    clients[namespace] = [connection];
	} else {
	    clients[namespace].push(connection);
	}

	/*
	  ignore incoming messages for now

	connection.on('message', function(message) {
	    var msgString = message.utf8Data;
	    console.log('message received:' + msgString);

	    for (var i in clients) {
		clients[i].sendUTF(msgString);
	    }
	});
	*/

	connection.on('close', function(connection, closeReason, description) {
	    console.log({connection:connection, closeReason:closeReason, description:description});
	    var index = clients[namespace].indexOf(connection);
	    clients[namespace].splice(index, 1);
	});
    });
}

exports.notify = function(namespace, name, value)
{
    namespaceClients = clients[namespace];
    if (namespaceClients !== undefined) {
	console.log('notifying '+clients[namespace].length+' clients');
	for (i=0;i<namespaceClients.length;i++) {
	    // REVISIT - should filter based on "name like pattern"
	    data = {};
	    data[name] = value;
	    namespaceClients[i].sendUTF(JSON.stringify(data));
	}
    } else {
	console.log('no listeners for namespace');
    }
}
