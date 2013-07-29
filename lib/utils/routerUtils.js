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
    
    res.gu = {
        status: {
            reachedAction: false,
            reachedEvents: false
        }
    };
    
    // Override common response object functions that end HTTP request processing (result functions)
    overrideResultFunction('render', controller, req, res, finishedCallback);
    overrideResultFunction('json', controller, req, res, finishedCallback);
    overrideResultFunction('jsonp', controller, req, res, finishedCallback);
    overrideResultFunction('send', controller, req, res, finishedCallback);
    overrideResultFunction('sendFile', controller, req, res, finishedCallback);
    overrideResultFunction('download', controller, req, res, finishedCallback);
    overrideResultFunction('redirect', controller, req, res, finishedCallback);
    overrideResultFunction('end', controller, req, res, finishedCallback);
    
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
    
    // Call middleware one after the other, each time waiting
    // for the next() function to get fired
    callNextMiddleware(middlewareCallbacks, controller, req, res, function() {
        res.gu.status.reachedAction = true;
        
        // finally run action
        action[verb].call(controller, req, res, function() {
        
            // This only runs if next() is called within the action instead of res.render/view/end etc.
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

// Overrides res.render, res.send, res.json, res.end etc.
function overrideResultFunction(resultFunc, controller, req, res, finishedCallback) {
    var func = res[resultFunc];
    
    res[resultFunc] = function() {
        var args = arguments;
        
        // We've reached the action method, so result function is being called by the action method
        if (res.gu.status.reachedAction) {
        
            // Result functions in Express.js sometimes call each other so
            // prevent events firing multiple times
            if (!res.gu.status.reachedEvents) {
                res.gu.status.reachedEvents = true;
                
                var middlewareCallbacks = [];
            
                controller.listeners('actionExecuted').forEach(function(listener) {
                    middlewareCallbacks.push(listener); 
                });
            
                controller.listeners('resultExecuting').forEach(function(listener) {
                    middlewareCallbacks.push(listener); 
                });
                
                callNextMiddleware(middlewareCallbacks, controller, req, res, function() {
                    // Call the original function
                    func.apply(res, args);
                    
                    // Fire resultExecuted events
                    var resultExecutedCallbacks = [];
                
                    controller.listeners('resultExecuted').forEach(function(listener) {
                        resultExecutedCallbacks.push(listener); 
                    });
                    
                    callNextMiddleware(resultExecutedCallbacks, controller, req, res, function() {
                        finishedCallback(null);
                    });
                });
            }
            else {
                // We're here because Express.js result functions sometimes
                // call each other, so just return the result function
                return func.apply(res, args);
            }
        }
        else {
            // If we've not reached the action, then result method is being
            // called by a filter or event and no further processing is required
            if (!res.gu.status.finished) {
                res.gu.status.finished = true;
                finishedCallback(null);
            }
            
            return func.apply(res, args);
        }
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

