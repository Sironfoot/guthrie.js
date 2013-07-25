'use strict';

var assert = require('assert');
var gu = require('../');

describe('Controller', function() {

    describe('#create()', function() {
    
        it('should set custom events', function(done) {
        
            var events = 0;
        
            var BaseController = gu.controller.create();
            
            BaseController.on('customEvent', function() {
                events++;
            });
        
            var Controller = gu.controller.inherit(BaseController);
            
            Controller.on('customEvent', function() {
                events++;
            });
            
            Controller.on('assertEvent', function() {
                assert.equal(events, 2, 'should have called the 2 events but got ' + events);
                done();
            });
            
            var controller = new Controller();
            controller.emit('customEvent');
            controller.emit('assertEvent');
        });
    
        it('should set the express app', function(done) {

            function testFunction() {
                assert.ok(this.app, 'this.app variable should be present');
                assert.equal(this.app, app, 'apps should be same object');
            }
        
            var app = {};
            var Controller = gu.controller.create({
                filters: [ testFunction ]
            });
            
            Controller.on('customEvent', function() {
                 testFunction.call(this);
                 done();
            });
            
            Controller.actions = {
                index: {
                    filters: [ testFunction ],
                    GET: testFunction
                }
            };
            
            var controller = new Controller(app);
            controller.filters[0].call(controller);
            controller.actions.index.filters[0].call(controller);
            controller.actions.index.GET.call(controller);
            controller.emit('customEvent');
            
            
        });
    
        describe('#filters', function() {
        
            it('should return filters when set', function() {
                var Controller = gu.controller.create({
                    filters: [
                        function(req, res, next) { },
                        function(req, res, next) { }
                    ]
                });
                
                var controller = new Controller();
                
                assert.ok(controller.filters.length === 2, '2 filters should be set');
            });
            
            it('should not return any filters when none set', function() {
                var Controller = gu.controller.create();
                var controller = new Controller();
                
                assert.ok(controller.filters.length === 0, 'No filters should be set.');
            });
        
        });
        
        describe('#actions', function() {
            
            it('should be created after Controller instantiation with correct verbs', function() {
                var Controller = gu.controller.create();
                
                Controller.actions = {
                    index: {
                        GET: function() {},
                        POST: function() {},
                        PUT: function() {},
                        DELETE: function() {}
                    },
                
                    test: {
                        GET: function() {}
                    }
                };
                
                var controller = new Controller();
                
                assert.ok(controller.actions['index'].GET, 'index.GET is missing');
                assert.ok(controller.actions['index'].POST, 'index.POST is missing');
                assert.ok(controller.actions['index'].PUT, 'index.PUT is missing');
                assert.ok(controller.actions['index'].DELETE, 'index.DELETE is missing');
                
                assert.ok(controller.actions['test'].GET, 'test.GET is missing');
                assert.ok(!controller.actions['test'].POST, 'test.POST was present but should not be');
                assert.ok(!controller.actions['test'].PUT, 'test.PUT was present but should not be');
                assert.ok(!controller.actions['test'].DELETE, 'test.DELETE was present but should not be');
            });
            
            it('should not be created if no HTTP verbs are set', function() {
                var Controller = gu.controller.create();
                
                Controller.actions.index = {
                    test: function() {}
                };
                
                var controller = new Controller();
                
                assert.ok(!controller.actions['index'], 'index property should not exist');
            });
            
            describe('#filters', function() {
                
                it('should return filters when set on actions', function() {
                    
                    var Controller = gu.controller.create();
                    
                    Controller.actions = {
                        index: {
                            filters: [
                                function() {},
                                function() {}
                            ],
                            
                            GET: function() {}
                        }
                    };
                    
                    var controller = new Controller();
                    
                    assert.ok(controller.actions['index'].filters.length === 2, 'should be 2 filters on index actions');
                });
            });
        });
    });
    
    describe('#inherit()', function() {
        
        it('should copy events, actions, and filters from BaseController', function() {
            var BaseController = gu.controller.create({
                filters: [
                    function() {},
                    function() {}
                ]
            });
            
            BaseController.on('customEvent', function() {});
            
            BaseController.actions = {
                baseIndex: {
                    filters: [
                        function() {},
                        function() {}
                    ],
                    
                    GET: function() {},
                    POST: function() {},
                    PUT: function() {},
                    DELETE: function() {}
                }
            };
            
            var Controller = gu.controller.inherit(BaseController, {
                filters: [
                    function() {},
                    function() {}
                ]
            });
            
            Controller.on('customEvent', function() {});
            
            Controller.actions = {
                index: {
                    filters: [
                        function() {},
                        function() {}
                    ],
                    
                    GET: function() {},
                    POST: function() {},
                    PUT: function() {},
                    DELETE: function() {}
                }
            };
            
            var controller = new Controller();
            
            assert.ok(controller.filters.length === 4, 'should be 4 filters');
            
            assert.ok(controller.actions.baseIndex.filters.length == 2, 'should be 2 filters on baseIndex');
            assert.ok(controller.actions.baseIndex.GET, 'baseIndex.GET is missing');
            assert.ok(controller.actions.baseIndex.POST, 'baseIndex.POST is missing');
            assert.ok(controller.actions.baseIndex.PUT, 'baseIndex.PUT is missing');
            assert.ok(controller.actions.baseIndex.DELETE, 'baseIndex.DELETE is missing');
            
            assert.ok(controller.actions.index.filters.length == 2, 'should be 2 filters on index');
            assert.ok(controller.actions.index.GET, 'index.GET is missing');
            assert.ok(controller.actions.index.POST, 'index.POST is missing');
            assert.ok(controller.actions.index.PUT, 'index.PUT is missing');
            assert.ok(controller.actions.index.DELETE, 'index.DELETE is missing');
            
            assert.equal(controller.listeners('customEvent').length, 2, 'should be 2 events');
        });
        
        it('should override BaseController actions with same name', function(done) {
            var BaseController = gu.controller.create();
            
            BaseController.actions = {
                index: {
                    GET: function() {
                        assert.ok(false, 'BaseController.actions.index should not get called');
                        done();
                    }
                }
            };
            
            var Controller = gu.controller.inherit(BaseController);
            
            Controller.actions = {
                index: {
                    GET: function() {
                        assert.ok(true);
                        done();
                    }
                }
            };
            
            var controller = new Controller();
            controller.actions.index.GET();
        });
    });
    
    describe('#viewbag()', function() {
        it('should set locals on HttpResponse object', function() {
             var res = {};
             res.locals = {};
             
             var Controller = gu.controller.create({
                 filters: [
                    function(req, res, next) {
                        this.viewbag(res).message1 = 'Hello';
                    }
                 ]
             });
             
             Controller.actions = {
                 index: {
                     GET: function(req, res) {
                         this.viewbag(res).message2 = 'World';
                     }
                 }
             };
             
             var controller = new Controller();
                     
             controller.filters[0].call(controller, null, res);
             controller.actions.index.GET.call(controller, null, res);
             
             assert.ok(res.locals.viewbag, 'viewbag property is missing');
             assert.equal(res.locals.viewbag.message1, 'Hello', 'viewbag.message1 is missing or wrong value');
             assert.equal(res.locals.viewbag.message2, 'World', 'viewbag.message2 is missing or wrong value');
        });
    });
});