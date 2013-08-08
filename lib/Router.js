'use strict';

var path = require('path');
var routerUtils = require('./utils/routerUtils');

var Router = function(app, rootDir, options) {
    options = options || {};
    
    this.rootDir = rootDir;
    this.controllersDir = options.controllersDir || path.join(this.rootDir, 'controllers');
    this.viewsDir = options.viewsDir || path.join(this.rootDir, 'views');

    app.gu = app.gu || {};
    app.gu.controllers = app.gu.controllers || {};
    app.gu.areas = app.gu.areas || {};
    
    // We're dealing with the creation of an 'area'
    if (options.areaName && options.areaDir) {
        app.gu.areas[options.areaName] = {
            dir: options.areaDir,
            controllersDir: options.controllersDir,
            viewsDir: options.viewsDir
        };
    }
    // otherwise just a standard router
    else {
        app.gu.rootDir = this.rootDir;
        app.gu.controllersDir = this.controllersDir;
        app.gu.viewsDir = this.viewsDir;
        
        var viewsExt = (options.viewsExt || app.get('view engine') || '').trim();
        viewsExt = viewsExt.substring(0, 1) === '.' ? viewsExt.slice(1) : viewsExt;
        app.gu.viewsExt = viewsExt.length > 0 ? ('.' + viewsExt) : '';
    }

    this.app = app;
};

Router.prototype.mapRoute = function(route, routeParams) {
    routeParams = routeParams || {};
    
    var router = this;
    
    this.app.all(route, function(req, res, next) {
    
        var controllerName = req.params.controller || routeParams.controller;
        var controller = routerUtils.resolveController(router.app, router.controllersDir, controllerName);
        if (!controller) {
            next();
            return;
        }
                
    	var actionName = req.params.action || routeParams.action || 'index';
        var action = controller.actions[actionName];
        if (!action) {
            next();
            return;
        }
        
        // GET, POST, PUT, DELETE
        var verb = (req.method || 'GET').toUpperCase();
        
        if (!action[verb]) {
	        next();
	        return;
        }
        
        // Helper method, calls render but pre-populates the view path
        res.view = function(locals, callback) {
            var viewFile = actionName + this.app.gu.viewsExt;
    		var view = path.join(router.viewsDir, controllerName, viewFile);
    		
        	res.render(view, locals, callback);
        };
        
        var executeContext = {
            controller: controller,
            action: action,
            verb: verb,
            req: req,
            res: res,
            next: next
        };
        
        routerUtils.executeController(executeContext, function(next) {
            if (next) {
                next();
            }
        });
    });
};

Router.prototype.createArea = function(areaName, options) {

    options = options || {};
    
    var areaDir = options.dir || path.join(this.rootDir, 'areas', areaName);

    var router = new Router(this.app, this.rootDir, {
        controllersDir: path.join(areaDir, 'controllers'),
        viewsDir: path.join(areaDir, 'views'),
        areaName: areaName,
        areaDir: areaDir
    });
    
    delete router.createArea;
    
    return router;
};

module.exports = Router;