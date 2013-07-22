'use strict';

var events = require('events');
var util = require('util');

var allowedEvents = [ 'actionExecuting', 'actionExecuted', 'resultExecuting', 'resultExecuted' ];

var Controller = function() {};
util.inherits(Controller, events.EventEmitter);

Controller.prototype.viewbag = function(res) {
    res.locals.viewbag = res.locals.viewbag || {};
    return res.locals.viewbag;
};

function createController(BaseController, config) {

    return (function(BaseController, config) {
    
        var _events = [];
        var _config = config || {};
    
        var _Controller = function(app) {
            this.expressApp = app;
            
            var controller = this;
            
            _events.forEach(function(event) {
                 controller.on(event.name, event.callback);
            });
            
            this._filters = _config.filters || [];
            
            Object.keys(_Controller).forEach(function(key) {
                var actionMethod = _Controller[key];
                
                if (actionMethod.GET || actionMethod.POST || actionMethod.PUT || actionMethod.DELETE) {
                    controller[key] = actionMethod;
                }
            });
            
            if (BaseController) {
                var baseController = new BaseController(app);
                
                baseController._filters.forEach(function(filter) {
                    controller._filters.push(filter);
                });

                Object.keys(BaseController).forEach(function(key) {
                    var actionMethod = BaseController[key];
                    
                    if (actionMethod.GET || actionMethod.POST || actionMethod.PUT || actionMethod.DELETE) {
                        controller[key] = actionMethod;
                    }
                });
                
                allowedEvents.forEach(function(allowedEvent) {
                    baseController.listeners(allowedEvent).forEach(function(listener) {
                        controller.on(allowedEvent, listener);
                    });
                });
            }
        };
        util.inherits(_Controller, Controller);
        
        _Controller.on = function(event, callback) {
            _events.push({ name: event, callback: callback });
        };
        
        return _Controller;
        
    })(BaseController, config);
};


exports.create = function(config) {
    return createController(null, config);
};


exports.inherit = function(BaseController, config) {
    return createController(BaseController, config);
};

