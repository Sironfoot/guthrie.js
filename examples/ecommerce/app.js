
/* Module dependencies.*/
var express = require('express');
var http = require('http');
var path = require('path');
var nunjucks = require('nunjucks');
var gu = require('../..');

var app = express();

// Nunjucks view engine
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));
env.express(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
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
    viewsDir: path.join(__dirname, 'views'),
    viewsExt: 'html'
});

router.mapRoute('/', { controller: 'home', action: 'index' });
router.mapRoute('/:controller/:action?/:id?');

// Fire up server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});