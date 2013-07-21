'use strict';

var events = require('events');
var util = require('util');

// Controller code
var Controller = {};


Controller.createController = function(BaseController, config) {

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

                baseController.listeners('request').forEach(function(listener) {
                    controller.on('request', listener);
                });
            }
        };
        util.inherits(_Controller, events.EventEmitter);
        
        _Controller.on = function(event, callback) {
            _events.push({ name: event, callback: callback });
        };
        
        return _Controller;
        
    })(BaseController, config);
};


Controller.create = function(config) {
    return Controller.createController(null, config);
};


Controller.inherit = function(BaseController, config) {
    return Controller.createController(BaseController, config);
};



var BaseController = Controller.create({
    filters: [
        function(req, res, next) {
            console.log('Filter in BaseController');
        }
    ]
});

BaseController.on('request', function() {
    console.log('request event fired in BaseController');
});





var HomeController = Controller.inherit(BaseController, {
    filters: [
        function(req, res, next) {
            console.log('Filter in HomeController');
        }
    ]
});

HomeController.on('request', function() {
    console.log('request event fired in HomeController');
});

HomeController.index = {

    filters: [
        function actionFilter1(req, res) {
            console.log('In homeController.actionFilter1');
        },
        function actionFilter2(req, res) {
            console.log('In homeController.actionFilter2');
        }
    ],

    GET: function(req, res) {
        console.log('In index.GET for HomeController');
    }
};

var homeController = new HomeController();



homeController._filters.forEach(function(filter) {
    filter.call(homeController);
});

homeController.emit('request');

homeController.index.GET();