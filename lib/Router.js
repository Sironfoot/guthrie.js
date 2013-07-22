'use strict';

var path = require('path');
//var EventEmitter = require('events').EventEmitter;

var Router = function(app, rootDir, options) {
    this.app = app;
    this.app.controllers = {};
    
    this.rootDir = rootDir;
    
    options = options || {};
    
    this.controllersDir = options.controllersDir || path.join(this.rootDir, 'controllers');
    this.viewsDir = options.viewsDir || path.join(this.rootDir, 'views');
};

Router.prototype._resolveController = function(controllerName) {
    var pathToController = path.join(this.controllersDir, controllerName + 'Controller.js');
        
    if (!this.app.controllers[pathToController]) {
        var Controller = require(pathToController);
        this.app.controllers[pathToController] = new Controller(this.app);
    }
    
    return this.app.controllers[pathToController];
};

Router.prototype.mapRoute = function(route, routeParams) {
    routeParams = routeParams || {};
    
    var router = this;
    
    this.app.all(route, function(req, res, next) {
    
        console.time('Test');
    
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
        
        var middlewareCallbacks = [];
        
        controller.listeners('actionExecuting').forEach(function(listener) {
            middlewareCallbacks.push(listener); 
        });
        
        // run controller's filters
        (controller._filters || []).forEach(function(filter) {
            middlewareCallbacks.push(filter);
        });
        
        // run the action method's filters
        (action.filters || []).forEach(function(filter) {
            middlewareCallbacks.push(filter);
        });
        
        // Override common response object functions that end HTTP request processing
        var render = res.render;
        var end = res.end;
    
        res.render = function() {
        
            var middlewareCallbacks = [];
            
            controller.listeners('actionExecuted').forEach(function(listener) {
                middlewareCallbacks.push(listener); 
            });
            
            controller.listeners('resultExecuting').forEach(function(listener) {
                middlewareCallbacks.push(listener); 
            });
        
            middlewareCallbacks.reverse();
            callNextMiddlewear(middlewareCallbacks, controller, req, res);
          	
          	render.apply(this, arguments);
        };
        
        // Helper method, calls render but pre-populates the view path
        res.view = function(locals, callback) {
			var view = path.join(router.viewsDir, controllerName, actionName);
	    	res.render(view, locals, callback);
        };
        
        res.end = function() {
            end.apply(this, arguments);
            
            controller.emit('resultExecuted', req, res, function() {});
            
            console.timeEnd('Test');
        };
        
        // finally run action
        middlewareCallbacks.push(action[verb]);
        
        middlewareCallbacks.reverse();
        callNextMiddlewear(middlewareCallbacks, controller, req, res);
    });
};

Router.prototype.createArea = function(areaName, options) {
    
};

function callNextMiddlewear(middlewareCallbacks, controller, req, res) {

    var func = middlewareCallbacks.pop();

    if (func) {
        func.call(controller, req, res, function() {
            callNextMiddlewear(middlewareCallbacks, controller, req, res);
        });
    }
}

module.exports = Router;