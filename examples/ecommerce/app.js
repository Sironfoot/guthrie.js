global.__appRoot = __dirname;

// require express & guthrie
var express = require('express');
var gu = require('../..');

// require middleware
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session')

// other requires
var path = require('path');
var nunjucks = require('nunjucks');

var app = express();

// Nunjucks view engine
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// configure middleware
app.set('views', __dirname + '/views');
app.set('rootDir', __dirname);

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'bicycle for the mind',
    resave: true,
    saveUninitialized: true
}));


// Initialise config file
gu.config.init({
    app: app,
    rootDir: __dirname
});

// Map routes
var router = new gu.Router(app, __dirname, {
    controllersDir: path.join(__dirname, 'controllers'),
    viewsDir: path.join(__dirname, 'views'),
    viewsExt: 'html'
});

router.mapRoute('/', {
    controller: 'home',
    action: 'index'
});

router.mapRoute('/category/:categoryId', {
    controller: 'category',
    action: 'show'
});

// Admin area
var adminArea = router.createArea('admin');
adminArea.mapRoute('/admin', { controller: 'home', action: 'index' });
adminArea.mapRoute('/admin/:controller/:action?/:id?');

// Catch all route
router.mapRoute('/:controller/:action?/:id?');

// Fire up server
app.listen(3000, function(){
    console.log('Express server listening on port: ' + 3000);
});