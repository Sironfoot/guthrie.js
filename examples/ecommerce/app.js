
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
  
//var gu = require('guthrie');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Map routes
//var router = new gu.Router(app, { rootDir: __dirname });

//router.mapRoute('/', { controller: 'home', action: 'index' });
//router.mapRoute('/products/:id/:name', { controller: 'products', action: 'show' });
//router.mapRoute('/:controller/:action?');

app.get('/:controller/:action?/:id?', function(req, res) {
	res.end('controller: ' + req.params.controller +
		', action: ' + req.params.action +
		', id: ' + req.params.id);
});
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
