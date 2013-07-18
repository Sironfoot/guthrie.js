'use strict';

var path = require('path');
var EventEmitter = require('events').EventEmitter;

var Router = function(app, rootDir, options) {
    this.app = app;
    this.rootDir = rootDir;
    
    options = options || {};
    
    this.controllersDir = options.controllersDir || path.join(this.rootDir, 'controllers');
    this.viewsDir = options.viewsDir || path.join(this.rootDir, 'views');
    
    this.controllers = {};
};

Router.prototype._resolveController = function(controllerName) {
    var pathToController = path.join(this.controllersDir, controllerName + 'Controller.js');
        
    if (!this.controllers[pathToController]) {
        this.controllers[pathToController] = require(pathToController);
    }
    
    return this.controllers[pathToController];
};

Router.prototype.mapRoute = function(route, routeParams) {
    routeParams = routeParams || {};
    
    var router = this;
    
    this.app.all(route, function(req, res, next) {
    
        var controllerName = req.params.controller || routeParams.controller;
        var controller = router._resolveController(controllerName);
        if (!controller) {
            next();
            return;
        }
                
    	var actionName = req.params.action || routeParams.action || 'index';
        var action = controller[actionName];
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
        
        // Recursively run this controller and all base controller filters/events
        var controllers = [];
        var currentController = controller;
        while (currentController) {
            controllers.push(currentController);
            currentController = currentController.prototype;
        }
        
        // emit controller's actionExecuting event
        controllers.forEach(function(controller) {
            controller.emit('actionExecuting', req, res, next);
        });
            
        // run controller's filters
        controllers.forEach(function(controller) {
	        (controller.filters || []).forEach(function(filter) {
		    	filter.call(controller, req, res, next);
	        });
        });
        
        // run the action method's filters
        (action.filters || []).forEach(function(filter) {
	       filter.call(controller, req, res, next);
        });
        
        // Override common response object functions that end HTTP request processing
        var render = res.render;
        var end = res.end;
    
        res.render = function() {
            controllers.forEach(function(controller) {
                controller.emit('actionExecuted', req, res, next);
            });
            
            controllers.forEach(function(controller) {
    	      	controller.emit('resultExecuting', req, res, next);
          	});
          	
          	render.apply(this, arguments);
        };
        
        // Helper method, calls render but pre-populates the view path
        res.view = function(locals, callback) {
			var view = path.join(router.viewsDir, controllerName, actionName);
	    	res.render(view, locals, callback);
        };
        
        res.end = function() {
            end.apply(this, arguments);
            
            controllers.forEach(function(controller) {
    	      	controller.emit('resultExecuted', req, res, next);
	      	});
        };
        
        // finally run action
        action[verb].call(controller, req, res, next);
    });
};

Router.prototype.createArea = function(areaName, options) {
    
};

module.exports = Router;