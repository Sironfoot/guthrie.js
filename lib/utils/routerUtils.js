'use strict';

var path = require('path');

exports.resolveController = function(app, controllersDir, controllerName) {

    app.gu = app.gu || {};
    app.gu.controllers = app.gu.controllers || {};

    var pathToController = path.join(controllersDir, controllerName + 'Controller.js');
    var controller = app.gu.controllers[pathToController];
        
    if (!controller) {
        var Controller = require(pathToController);
        controller = new Controller(app);
        
        app.gu.controllers[pathToController] = controller;
    }
    
    return controller;
};

exports.executeController = function(executeContext, finishedCallback) {
    var controller = executeContext.controller;
    var action = executeContext.action;
    var verb = executeContext.verb;
    
    var req = executeContext.req;
    var res = executeContext.res;
    var next = executeContext.next;
    
    res.gu = {};
    
    // Override common response object functions that end HTTP request processing
    overrideResultFunction('render', controller, req, res);
    overrideResultFunction('json', controller, req, res);
    overrideResultFunction('jsonp', controller, req, res);
    overrideResultFunction('send', controller, req, res);
    overrideResultFunction('sendFile', controller, req, res);
    overrideResultFunction('redirect', controller, req, res);
    
    var end = res.end;

    res.end = function() {
    
        end.apply(this, arguments);
        
        var resultExecutedCallbacks = [];
        
        if (this.gu.reachedAction) {
            controller.listeners('resultExecuted').forEach(function(listener) {
                resultExecutedCallbacks.push(listener); 
            });
        }
        
        callNextMiddleware(resultExecutedCallbacks, controller, req, res, function() {
            finishedCallback(null);
        });
    };
    
    // Build up a collection of middleware callbacks
    var middlewareCallbacks = [];
    
    // actionExecuting events
    controller.listeners('actionExecuting').forEach(function(listener) {
        middlewareCallbacks.push(listener);
    });
    
    // run controller's filters
    (controller.filters || []).forEach(function(filter) {
        middlewareCallbacks.push(filter);
    });
    
    // run the action method's filters
    (action.filters || []).forEach(function(filter) {
        middlewareCallbacks.push(filter);
    });
    
    // Helper method, calls render but pre-populates the view path
    res.view = function(locals, callback) {
		var view = path.join(router.viewsDir, controllerName, actionName);
    	res.render(view, locals, callback);
    };
    
    // Call middleware one after the other, each time waiting
    // for the next() function to get fired
    callNextMiddleware(middlewareCallbacks, controller, req, res, function() {
        res.gu.reachedAction = true;
        
        // finally run action
        action[verb].call(controller, req, res, function() {
        
            // This only runs if next() is called within the action instead if res.render/view/end etc.
            var actionExecutedCallbacks = [];
            
            controller.listeners('actionExecuted').forEach(function(listener) {
                actionExecutedCallbacks.push(listener); 
            });
            
            callNextMiddleware(actionExecutedCallbacks, controller, req, res, function() {
                finishedCallback(next);
            });
        });
    });
};

function overrideResultFunction(resultFunc, controller, req, res) {
    var func = res[resultFunc];
    
    res[resultFunc] = function() {
        var args = arguments;
        
        var middlewareCallbacks = [];
        
        if (res.gu.reachedAction) {
            controller.listeners('actionExecuted').forEach(function(listener) {
                middlewareCallbacks.push(listener); 
            });
        
            controller.listeners('resultExecuting').forEach(function(listener) {
                middlewareCallbacks.push(listener); 
            });
        }
        
        callNextMiddleware(middlewareCallbacks, controller, req, res, function() {
            func.apply(res, args);
        });
    };
}


function callNextMiddleware(middlewareCallbacks, controller, req, res, finalCallback) {

    var func = middlewareCallbacks.shift();

    if (func) {
        func.call(controller, req, res, function() {
            callNextMiddleware(middlewareCallbacks, controller, req, res, finalCallback);
        });
    }
    else {
        if (finalCallback) {
            finalCallback();
        }
    }
}

