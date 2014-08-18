
var mysql = require('mysql');

var Database = function(){};

Database.pool = null;
Database.connected = false;
Database.config = {
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'mysql'
};

Database.connect = function(app){
	if (!this.pool) {
		this.config['host']     = app.config['db_host'];
		this.config['user']     = app.config['db_user'];
		this.config['password'] = app.config['db_password'];
		this.config['database'] = app.config['db_name'];
		
		this.pool = mysql.createPool(this.config);
		this.connected = true;
	}
};

Database.handleQueryError = function(err, connection){
	if (err) {
		if (connection) {
			connection.release();
		}
		
		console.error(err.stack);
		return true;
	}
	return false;
};

Database.handleQuerySuccess = function(callback, result, connection){
	if (callback) {
		callback(result);
	}
	if (connection) {
		connection.release(); //release
	}     	
};

Database.instance = function(model){
	var db = this;
	model.getConnection = function(callback) {
		if (!db.connected) return;

		db.pool.getConnection(function(err, connection) {
			if (db.handleQueryError(err, connection)) {
				db.connected = false;
			} else {
				callback(connection);
			}
		});
	};
	
	//exec
	model.exec = function(sql, callback) {
		if (sql) {
			this.getConnection(function(connection) {
				connection.query(sql, function(err, result) {
	            	if (!db.handleQueryError(err, connection)) { 
						db.handleQuerySuccess(callback, result, connection);
					}
				});
	     	});
		}
	};
	
	//save
	model.insert = function(values, callback) {
		if (values) {
			this.getConnection(function(connection) {
				connection.query("insert into " + model.tablename + " set ?", values, function(err, result) {
	            	if (!db.handleQueryError(err, connection)) { 
						db.handleQuerySuccess(callback, result, connection);
					}
				});
	     	});
		}
	};
	
	//get
	model.get = function(key, value, callback) {
		if (!callback && value instanceof Function) {
			callback = value;
			value = key;
			key = model.querykey;
		}
		if (key != null && key != "") {
			this.getConnection(function(connection) {
	        	connection.query("select * from " + model.tablename + " where "+key+"=?", value, function(err, result) {
	            	if (!db.handleQueryError(err, connection)) { 
						db.handleQuerySuccess(callback, result, connection);
					}
	          	});
	        });
	    }
	};
	
	//update
	model.update = function(key, value, values, callback) {
		if (!callback && values instanceof Function) {
			callback = values;
			values = value;
			value = key;
			key = model.querykey;
		}
		if (key != null && key != "" && values) {
			this.getConnection(function(connection) {
	        	connection.query("update " + model.tablename + " set ? where "+key+"=" + connection.escape(value), values, function(err, result) {
	            	if (!db.handleQueryError(err, connection)) { 
						db.handleQuerySuccess(callback, result, connection);
					}
				});
			});
		}
	};
	
	//delete
	model.remove = function(key, value, callback) {
		if (!callback && value instanceof Function) {
			callback = value;
			value = key;
			key = model.querykey;
		}
		if (key != null && key != "") {
			this.getConnection(function(connection) {
	        	connection.query("delete from " + model.tablename + " where "+key+"=?", value, function(err, result) {
	            	if (!db.handleQueryError(err, connection)) { 
						db.handleQuerySuccess(callback, result, connection);
					}
				});
	         
			});
		}
	};
	
	//exists
	model.exists = function(tablename, callback) {
		if (tablename) {
			this.getConnection(function(connection) {
				var sql = "select table_name from information_schema.tables where table_schema='" + config.database + "' and table_name='" + tablename + "'";
	          	connection.query(sql, function(err, result) {
	            	if (!db.handleQueryError(err, connection)) { 
						db.handleQuerySuccess(callback, result, connection);
					}
	          	});
	        });
	    }
	};
	
	//clear
	model.clear = function(tablename, callback) {
		if (tablename) {
			this.getConnection(function(connection) {
				var sql = "TRUNCATE TABLE " + tablename;
	          	connection.query(sql, function(err, result) {
	            	if (!db.handleQueryError(err, connection)) { 
						db.handleQuerySuccess(callback, result, connection);
					}
				});
			});
		}
	};
	
	//count
	model.count = function(callback) {
		this.getConnection(function(connection) {
	    	connection.query("select count(*) as count from " + model.tablename, function(err, result) {
				if (!db.handleQueryError(err, connection)) { 
					db.handleQuerySuccess(callback, result[0].count, connection);
				}
	        });
	       
		});
	};
	
	model.countBySql = function(sql, callback) {
		this.getConnection(function(connection) {
	    	connection.query("select count(*) as count from ( " + sql + " ) T", function(err, result) {
	        	if (!db.handleQueryError(err, connection)) { 
					db.handleQuerySuccess(callback, result[0].count, connection);
				}
	        });	
		});
	};
	
	//query
	model.where = function(obj, callback) {
		var sql = "select * from " + model.tablename + " where 1=1";
		if (obj) {
			for (var pro in obj) {
				sql += " and " + pro + "=" + db.pool.escape(obj[pro]);
	       	}
		}
		this.getConnection(function(connection) {
			connection.query(sql, function(err, result) {
				if (!db.handleQueryError(err, connection)) { 
					db.handleQuerySuccess(callback, result, connection);
				}
			});
		});
	};
	
	model.queryAll = function(callback) {
		this.getConnection(function(connection) {
			connection.query("select * from " + model.tablename, function(err, result) {
	        	if (!db.handleQueryError(err, connection)) { 
					db.handleQuerySuccess(callback, result, connection);
				}
	        });
		});
	};
	
	model.queryPage = function(page, callback) {
		this.count(function(result) {
	        //计数
	        page.totalCount = result;
	        page.totalPage = Math.ceil(page.totalCount / page.pageSize);
	        //分页
	        this.getConnection(function(connection) {
	          	connection.query("select * from " + model.tablename + " limit " + page.start + "," + page.end + "", function(err, result) {
	            	if (!db.handleQueryError(err, connection)) { 
	            		page.data = result;
						db.handleQuerySuccess(callback, page, connection);
					}
	        	});
			});
		});
	};
	
	model.queryPageBySql = function(sql, page, callback) {
		this.countBySql(sql, function(result) {
			//计数
	        page.totalCount = result[0].count;
	        page.totalPage = Math.ceil(page.totalCount / page.pageSize);
	        //分页
	        this.getConnection(function(connection) {
	        	connection.query("select * from  ( " + sql + " ) T limit " + page.start + "," + page.end + "", function(err, result) {
		            if (!db.handleQueryError(err, connection)) {
		            	page.data = result;
						db.handleQuerySuccess(callback, page, connection);
					}
		        });
		   	});
		});
	};
};

module.exports = Database;
