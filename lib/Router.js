'use strict';

var path = require('path');
var routerUtils = require('./utils/routerUtils');

var Router = function(app, rootDir, options) {
    options = options || {};
    
    this.rootDir = rootDir;

    app.gu = {};
    app.gu.controllers = {};
    app.gu.controllersDir = options.controllersDir || path.join(this.rootDir, 'controllers');
    app.gu.viewsDir = options.viewsDir || path.join(this.rootDir, 'views');
    
    var viewsExt = (options.viewsExt || app.get('view engine') || '').trim();
    viewsExt = viewsExt.substring(0, 1) === '.' ? viewsExt.slice(1) : viewsExt;
    app.gu.viewsExt = viewsExt.length > 0 ? ('.' + viewsExt) : '';

    this.app = app;
};

Router.prototype.mapRoute = function(route, routeParams) {
    routeParams = routeParams || {};
    
    var router = this;
    
    this.app.all(route, function(req, res, next) {
    
        var controllerName = req.params.controller || routeParams.controller;
        var controller = routerUtils.resolveController(router.app, router.app.gu.controllersDir, controllerName);
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
    		var view = path.join(this.app.gu.viewsDir, controllerName, viewFile);
    		
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

module.exports = Router;