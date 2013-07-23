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
                'BaseController.resultExecuted',
                'Controller.resultExecuted'
            ];
            
            var actualOrder = [];
            
            var BaseController = gu.controller.create({
                filters: [
                    function(req, res, next) {
                        actualOrder.push('BaseController.filter1');
                        next();
                    },
                    function(req, res, next) {
                        actualOrder.push('BaseController.filter2');
                        next();
                    }
                ]
            });
            
            BaseController.on('actionExecuting', function(req, res, next) {
                actualOrder.push('BaseController.actionExecuting');
                next();
            });
            
            BaseController.on('actionExecuted', function(req, res, next) {
                actualOrder.push('BaseController.actionExecuted');
                next();
            });
            
            BaseController.on('resultExecuting', function(req, res, next) {
                actualOrder.push('BaseController.resultExecuting');
                next();
            });
            
            BaseController.on('resultExecuted', function(req, res, next) {
                actualOrder.push('BaseController.resultExecuted');
                next();
            });
        
            var Controller = gu.controller.create({
                filters: [
                    function(req, res, next) {
                        actualOrder.push('Controller.filter1');
                        next();
                    },
                    function(req, res, next) {
                        actualOrder.push('Controller.filter2');
                        next();
                    }
                ]
            });
            
            Controller.on('actionExecuting', function(req, res, next) {
                actualOrder.push('Controller.actionExecuting');
                next();
            });
            
            Controller.on('actionExecuted', function(req, res, next) {
                actualOrder.push('Controller.actionExecuted');
                next();
            });
            
            Controller.on('resultExecuting', function(req, res, next) {
                actualOrder.push('Controller.resultExecuting');
                next();
            });
            
            Controller.on('resultExecuted', function(req, res, next) {
                actualOrder.push('Controller.resultExecuted');
                next();
            });
            
            Controller.actions = {
                index: {
                    filters: [
                        function(req, res, next) {
                            actualOrder.push('action.filter1');
                            next();
                        },
                        function(req, res, next) {
                            actualOrder.push('action.filter2');
                            next();
                        }
                    ],
                    GET: function(req, res) {
                        actualOrder.push('action');
                    }
                }
            }
            
            var controller = new Controller();
            
            routerUtils.executeController(controller, function() {
            
                expectedOrder.forEach(function(expectedMessage, index) {
                    var actualMessage = actualOrder[index];
                    assert.equal(actualMessage, expectedMessage, 'at index pos: ' + index);
                });
            
                done();
            });
        });
        
        it('should allow action to call next()');
        
        it('should allow any event or filter to call next()');
    });
});