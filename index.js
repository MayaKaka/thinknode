
var http = require('http'),
  	express = require('express'),
	config = require('./config'),
	Think = require('./think/Think'),
	database = require('./think/Database');

var app = express();

app.configure(function(){
  	
    app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser({ uploadDir:__dirname+'/'+config['uploads_path'] }));
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	// app.use(express.session());
	app.use(app.router);

});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.config = config;
app.database = database;

Think.start(app, global, express);

http.createServer(app).listen(config['app_port'], function(){
	console.log('Express server listening on port '+config['app_port']);
});

