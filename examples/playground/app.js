global.__appRoot = __dirname;

var pathToRegexp = require('path-to-regexp');

var guthrie = function(app, rootDir, options) {

    this.app = app;
    this.rootDir = rootDir;
    
    this.options = options || {};
    this.options.controllerDir = this.options.controllerDir || path.join(this.rootDir, 'controllers');
    this.options.viewDir = this.options.viewDir || path.join(this.rootDir, 'views');
    
    var self = this;
    
    function view(model) {
        var res = this;
        res.render(self.options.viewDir);
    }

    return function handleRequest(req, res, next) {
        res.view = view.bind(res);
    
        var url = req.url;
    
        var keys = [];
        var re = pathToRegexp('/foo/:bar', keys);

        console.dir(re.exec(url)[1]);
        
        next();
    };
};

guthrie.router = function() {
    var that = this;
    
    that.routes = [];
    
    return {
        mapRoute: function(path, defaults) {
            that.routes.push({
                path: path,
                defaults: defaults
            });
        }
    };
};


var express = require('express');
var path = require('path');

// require middleware
var favicon = require('serve-favicon');

var app = express();

// configure middleware
app.set('views', __dirname + '/views');
app.set('rootDir', __dirname);

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(guthrie(app, __dirname));

//var router = guthrie.router();
//router.mapRoute('/:controller/:action');


// Fire up server
app.listen(3000, function(){
    console.log('Express server listening on port: ' + 3000);
});





