'use strict';

var events = require('events');
var util = require('util');

var Controller = function() {};
util.inherits(Controller, events.EventEmitter);

function createController(BaseController, config) {

    return (function(BaseController, config) {
    
        var _config = config || {};
    
        var _Controller = function(app) {
            this.app = app;
            this.filters = [];
            this.actions = {};
            
            var controller = this;
            
            _Controller.events.forEach(function(event) {
                 controller.on(event.name, event.callback);
            });
            
            _Controller.filters.forEach(function(filter) {
                 controller.filters.push(filter);
            });
            
            Object.keys(_Controller.actions || {}).forEach(function(key) {
                var actionMethod = _Controller.actions[key];
                
                if (actionMethod.GET || actionMethod.POST || actionMethod.PUT || actionMethod.DELETE) {
                    controller.actions[key] = actionMethod;
                }
            });
            
            if (BaseController) {
                var baseController = new BaseController(app);
            
                Object.keys(baseController.actions || {}).forEach(function(key) {
                    var actionMethod = baseController.actions[key];
                    
                    if (actionMethod.GET || actionMethod.POST || actionMethod.PUT || actionMethod.DELETE) {
                        if (!controller.actions[key]) {
                            controller.actions[key] = actionMethod;
                        }
                    }
                });
            }
        };
        util.inherits(_Controller, Controller);
        
        _Controller.filters = [];
        _Controller.events = [];
        _Controller.actions = {};

        if (BaseController) {
            (BaseController.events || []).forEach(function(event) {
                _Controller.events.push(event);
            });
            
            (BaseController.filters || []).forEach(function(filter) {
                _Controller.filters.push(filter);
            });
        }
        
        _Controller.on = function(event, callback) {
            _Controller.events.push({ name: event, callback: callback });
        };
        
        (_config.filters || []).forEach(function(filter) {
            _Controller.filters.push(filter);
        });
        
        return _Controller;
        
    })(BaseController, config);
};


exports.create = function(config) {
    return createController(null, config);
};


exports.inherit = function(BaseController, config) {
    return createController(BaseController, config);
};

