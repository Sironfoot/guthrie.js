'use strict';

var events = require('events');
var util = require('util');

var Controller = function() {};
util.inherits(Controller, events.EventEmitter);

Controller.prototype.viewbag = function(res) {
    res.locals.viewbag = res.locals.viewbag || {};
    return res.locals.viewbag;
};

function createController(BaseController, config) {

    return (function(BaseController, config) {
    
        var _config = config || {};
    
        var _Controller = function(app) {
            this.app = app;
            this.filters = _config.filters || [];
            this.actions = {};
            
            var controller = this;
            
            _Controller.events.forEach(function(event) {
                 controller.on(event.name, event.callback);
            });
            
            Object.keys(_Controller.actions || {}).forEach(function(key) {
                var actionMethod = _Controller.actions[key];
                
                if (actionMethod.GET || actionMethod.POST || actionMethod.PUT || actionMethod.DELETE) {
                    controller.actions[key] = actionMethod;
                }
            });
            
            if (BaseController) {
                var baseController = new BaseController(app);
                
                baseController.filters.forEach(function(filter) {
                    controller.filters.push(filter);
                });
            
                Object.keys(baseController.actions || {}).forEach(function(key) {
                    var actionMethod = baseController.actions[key];
                    
                    if (actionMethod.GET || actionMethod.POST || actionMethod.PUT || actionMethod.DELETE) {
                        if (!controller.actions[key]) {
                            controller.actions[key] = actionMethod;
                        }
                    }
                });
                
                var uniqueEventNames = [];
                
                BaseController.events.forEach(function(event) {
                    if (uniqueEventNames.indexOf(event.name) === -1) {
                        uniqueEventNames.push(event.name);
                    }
                });
                
                uniqueEventNames.forEach(function(eventName) {
                    baseController.listeners(eventName).forEach(function(listener) {
                        controller.on(eventName, listener);
                    });
                });
            }
        };
        util.inherits(_Controller, Controller);
        
        _Controller.events = [];
        _Controller.actions = {};
        
        _Controller.on = function(event, callback) {
            _Controller.events.push({ name: event, callback: callback });
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

