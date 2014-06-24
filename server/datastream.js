config = {
    httpPort: 8000,
    wsPort: 8001
};

var wsServer = require('./ws-server');
var httpServer = require('./http-server');
var dataStore = require('./mysql-datastore');

dataConnection = dataStore.connection();
dataConnection.connect();
wsServer.listen(config.wsPort);
httpServer.listen(config.httpPort, dataConnection, wsServer);

//----------------------------------------------------------------------
// websocket 
//----------------------------------------------------------------------




