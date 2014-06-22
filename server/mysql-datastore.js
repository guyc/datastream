var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'datastream',
    password: 'datastream',
    database: 'datastream'
});

exports.connect = function() {
    connection.connect();
    return connection;
}
