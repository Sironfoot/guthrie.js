
/* Module dependencies.*/
var express = require('express');
var http = require('http');
var path = require('path');
var util = require('util');
var events = require('events');
var nunjucks = require('nunjucks');
  
var gu = require('../..');

var app = express();

// all environments
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));
env.express(app);

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
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
router.mapRoute('/:controller/:action?/:id?');

// Fire up server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});