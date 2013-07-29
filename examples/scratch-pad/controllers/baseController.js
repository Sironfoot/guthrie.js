var gu = require('../../..');

var BaseController = gu.controller.create({
    filters: [
        function baseFilter1(req, res, next) {
            console.log('In baseController.baseFilter1');
            setTimeout(next, 100);
        },
        function baseFilter2(req, res, next) {
            console.log('In baseController.baseFilter2');
            setTimeout(next, 100);
        }
    ]
});

BaseController.on('actionExecuting', function(req, res, next) {
    console.log('In baseController.actionExecuting');
    
    this.viewbag(res).authUser = 'Dominic Pettifer';
    
    setTimeout(next, 100);
});

BaseController.on('actionExecuted', function(req, res, next) {
    console.log('In baseController.actionExecuted');
    setTimeout(next, 100);
});

BaseController.on('resultExecuting', function(req, res, next) {
    console.log('In baseController.resultExecuting');
    setTimeout(next, 100);
});

BaseController.on('resultExecuted', function(req, res) {
    console.log('In baseController.resultExecuted');
});

module.exports = BaseController;