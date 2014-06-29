var mysql = require('mysql');

exports.connection = function() {
    return {
        connection: mysql.createConnection({
	    host: 'localhost',
	    user: 'datastream',
	    password: 'datastream',
	    database: 'datastream',
	    socketPath: '/var/lib/mysql/mysql.sock'
	}),

	connect: function() {
	    this.connection.connect();
	},

	update: function(namespace, name, value, cb) {
	    this.connection.query('UPDATE `data` SET value=? WHERE `namespace`=? AND `name`=?',[value,namespace,name], cb);
	},

	insert: function(namespace, name, value, cb) {
            this.connection.query('INSERT INTO `data` SET `namespace`=?, `name`=?, `value`=?',[namespace,name,value], cb);
	},

        set: function(namespace, name, value, cb) {
	    var ds = this;
            ds.update(namespace, name, value, function(err, results) {
		console.log({results:results,err:err});
		if (results.affectedRows == 0) {
		    console.log({namespace:namespace, name:name, value:value});
		    ds.insert(namespace, name, value, function(err, results) {
			console.log({results:results,err:err});
		    });
		}
	    });
	},

	get: function(namespace, name, cb) {
	    this.connection.query('SELECT * FROM `data` WHERE `namespace`=? AND `name`=? LIMIT 1', [namespace, name], function(err, results) {
		console.log(results);
		console.log(err);
		var value = undefined;
		if (err === null) {
		    if (results.length > 0) {
			value = results[0].value;
		    }
		}
		cb(err, value);
	    });
	},

	getAll: function(namespace, pattern, cb) {
	    console.log(pattern);
	    this.connection.query('SELECT * FROM `data` WHERE `namespace`=? AND `name` LIKE ?', [namespace, pattern], function(err, results) {
		console.log(this.sql);
		console.log(results);
		console.log(err);
		var data = undefined;
		if (err === null) {
		    var data = {};
		    for (var i=0;i<results.length;i++) {
			data[results[i].name] = results[i].value;
		    }
		}
		console.log(data);
		cb(err, data);
	    });
	}
	    
    };
}
