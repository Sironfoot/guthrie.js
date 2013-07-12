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

Router.prototype.mapRoute = function(route, routeParams) {
    routeParams = routeParams || {};

    var controllerName = routeParams.controller;
    var actionName = routeParams.action;
    
    var controller = null;
    
    if (controllerName) {
        
        var pathToController = path.join(this.controllersDir, controllerName + 'Controller.js');
        
        if (!this.controllers[pathToController]) {
            this.controllers[pathToController] = require(pathToController);
        }
        
        controller = this.controllers[pathToController];
    }
    
    var action = controller ? controller[actionName] : null;
    
    var router = this;
    
    this.app.all(route, function(req, res, next) {
    
        if (!controller) {
        	controllerName = req.params.controller;
            var pathToController = path.join(router.controllersDir, rcontrollerName + 'Controller.js');
            
            if (!router.controllers[pathToController]) {
                router.controllers[pathToController] = require(pathToController);
            }
        
            controller = router.controllers[pathToController];
            
            if (!controller) {
                next();
                return;
            }
        }
        
        if (!action) {
        	actionName = req.params.action;
            action = controller[actionName];
            
            if (!action) {
                next();
                return;
            }
        }
        
        // GET, POST, PUT, DELETE
        var verb = req.method;
        
        if (!action[verb]) {
	        next();
	        return;
        }
        
        // Recursively run this controller and all base controller filters
		var filteredController = controller;
        while (filteredController) {
	        (filteredController.filters || []).forEach(function(filter) {
		    	filter(req, res, next);
	        });
	        
	        filteredController = filteredController.prototype;
        }
        
        // ...then run the action method's filters
        (action.filters || []).forEach(function(filter) {
	       filter(req, res, next); 
        });
        
        // Helper view method for response object
        var render = res.render;
        
        res.render = function() {
	      	controller.emit('resultExecuting', req, res, next);
	      	render.apply(this, arguments);
	      	//controller.emit('resultExecuted', req, res, next);
        };
        
        res.view = function(locals, callback) {
			var view = path.join(router.viewsDir, controllerName, actionName);
	    	res.render(view, locals, callback);
        };
        
        // emit before action executing
        controller.emit('actionExecuting', req, res, next);
        
        // run action
        action[verb](req, res, next);
        
        // emit after action executed
        controller.emit('actionExecuted', req, res, next);
    });
};

Router.prototype.createArea = function(areaName, options) {
    
};

exports.Router = Router;



// Controller base class

var Controller = function(options) {
	options = options || {};
	this.filters = options.filters || [];
};

Controller.prototype = Object.create(EventEmitter.prototype);

exports.Controller = Controller;
