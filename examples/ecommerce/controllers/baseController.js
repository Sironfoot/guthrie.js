var gu = require('../../..');

var BaseController = gu.controller.create({
    filters: [
        function baseFilter1(req, res, next) {
            console.log('In baseController.baseFilter1');
            next();
        },
        function baseFilter2(req, res, next) {
            console.log('In baseController.baseFilter2');
            next();
        }
    ]
});

BaseController.on('actionExecuting', function(req, res, next) {
    console.log('In baseController.actionExecuting');
    next();
});

BaseController.on('actionExecuted', function(req, res, next) {
    console.log('In baseController.actionExecuted');
    next();
});

BaseController.on('resultExecuting', function(req, res, next) {
    console.log('In baseController.resultExecuting');
    next();
});

BaseController.on('resultExecuted', function(req, res, next) {
    console.log('In baseController.resultExecuted');
    next();
});

module.exports = BaseController;