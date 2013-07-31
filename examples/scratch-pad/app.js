
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , util = require('util')
  , events = require('events');
  
var gu = require('../..');

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
var router = new gu.Router(app, __dirname, {
    controllersDir: path.join(__dirname, 'controllers'),
    viewsDir: path.join(__dirname, 'views')
});

router.mapRoute('/', { controller: 'home', action: 'index' });
router.mapRoute('/products/:id/:name', { controller: 'products', action: 'show' });
router.mapRoute('/:controller/:action?/:id?');

//var adminArea = router.createArea('admin', { dir: 'areas/admin' });
//adminArea.mapRoute('/admin/:controller/:action?/:id?');


// Fire up server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});