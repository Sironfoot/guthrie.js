'use strict';

var assert = require('assert');
var gu = require('../../');
var routerUtils = require('../../lib/utils/routerUtils');

describe('routerUtils', function() {

    describe('#executeController()', function() {
        it('should execute filters, events and actions sequentially and in the correct order', function(done) {
        
            var expectedOrder = [
                'BaseController.filter1',
                'BaseController.filter2',
                'Controller.filter1',
                'Controller.filter2',
                'BaseController.actionExecuting',
                'Controller.actionExecuting',
                'action.filter1',
                'action.filter2',
                'action',
                'BaseController.actionExecuted',
                'Controller.actionExecuted',
                'BaseController.resultExecuting',
                'Controller.resultExecuting',
                'result',
                'BaseController.resultExecuted',
                'Controller.resultExecuted'
            ];
            
            var actualOrder = [];
            
            var BaseController = gu.controller.create({
                filters: [
                    function(req, res, next) {
                        actualOrder.push('BaseController.filter1');
                        setTimeout(next, 2);
                    },
                    function(req, res, next) {
                        actualOrder.push('BaseController.filter2');
                        setTimeout(next, 2);
                    }
                ]
            });
            
            BaseController.on('actionExecuting', function(req, res, next) {
                actualOrder.push('BaseController.actionExecuting');
                setTimeout(next, 2);
            });
            
            BaseController.on('actionExecuted', function(req, res, next) {
                actualOrder.push('BaseController.actionExecuted');
                setTimeout(next, 2);
            });
            
            BaseController.on('resultExecuting', function(req, res, next) {
                actualOrder.push('BaseController.resultExecuting');
                setTimeout(next, 2);
            });
            
            BaseController.on('resultExecuted', function(req, res, next) {
                actualOrder.push('BaseController.resultExecuted');
                setTimeout(next, 2);
            });
        
            var Controller = gu.controller.create({
                filters: [
                    function(req, res, next) {
                        actualOrder.push('Controller.filter1');
                        setTimeout(next, 2);
                    },
                    function(req, res, next) {
                        actualOrder.push('Controller.filter2');
                        setTimeout(next, 2);
                    }
                ]
            });
            
            Controller.on('actionExecuting', function(req, res, next) {
                actualOrder.push('Controller.actionExecuting');
                setTimeout(next, 2);
            });
            
            Controller.on('actionExecuted', function(req, res, next) {
                actualOrder.push('Controller.actionExecuted');
                setTimeout(next, 2);
            });
            
            Controller.on('resultExecuting', function(req, res, next) {
                actualOrder.push('Controller.resultExecuting');
                setTimeout(next, 2);
            });
            
            Controller.on('resultExecuted', function(req, res, next) {
                actualOrder.push('Controller.resultExecuted');
                setTimeout(next, 2);
            });
            
            Controller.actions = {
                index: {
                    filters: [
                        function(req, res, next) {
                            actualOrder.push('action.filter1');
                            setTimeout(next, 2);
                        },
                        function(req, res, next) {
                            actualOrder.push('action.filter2');
                            setTimeout(next, 2);
                        }
                    ],
                    GET: function(req, res) {
                        actualOrder.push('action');
                        res.end();
                    }
                }
            }
            
            var controller = new Controller();
            
            var req = {};
            
            var res = {};
            res.end = function() {
                actualOrder.push('result');
            };
            
            var next = function() {};
            
            routerUtils.executeController(controller, req, res, next, function() {
            
                expectedOrder.forEach(function(expectedMessage, index) {
                    var actualMessage = actualOrder[index];
                    assert.equal(actualMessage, expectedMessage, 'at index pos: ' + index);
                });
            
                done();
            });
        });
        
        it('should not provide a next() middlewear callback if next is not called in action', function(done) {
            var Controller = gu.controller.create();
            
            Controller.actions = {
                index: {
                    GET: function(req, res, next) {
                        res.end();
                    }
                }
            };
            
            var controller = new Controller();
            
            var req = {};
            
            var res = {};
            res.next = function() {};
            
            var next = function() {};
            
            routerUtils.executeController(controller, req, res, next, function(next) {
                assert.ok(!next, 'next middlewear should NOT be present');
                done();
            });
        });
        
        it('should allow action to call next()', function(done) {
            var Controller = gu.controller.create();
            
            Controller.actions = {
                index: {
                    GET: function(req, res, next) {
                        next();
                    }
                }
            };
            
            var controller = new Controller();
            
            var req = {};
            var res = {};
            var next = function() {};
            
            routerUtils.executeController(controller, req, res, next, function(next) {
                assert.ok(next, 'next middleware callback should be present');
                done();
            });
        });
        
        it('should allow any event/filter to NOT call next() and prevent further processig', function(done) {
            var Controller = gu.controller.create({
                filters: [
                    function(req, res, next) {
                        res.end('I am ending this!');
                    }
                ]
            });
            
            Controller.actions = {
                index: {
                    GET: function(req, res, next) {
                        assert.ok(false, 'We should never reach this point');
                    }
                }
            };
            
            var req = {};
            
            var res = {};
            res.end = function() {};
            
            var next = function() {};
            
            var controller = new Controller();
            
            routerUtils.executeController(controller, req, res, next, function(next) {
                assert.ok(!next, 'next middleware callback should not be present');
                
                done();
            });
        });
    });
});