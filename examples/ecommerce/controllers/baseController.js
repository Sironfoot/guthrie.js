var gu = require('../../..');

var baseController = new gu.Controller({
    filters: [
        function baseFilter1(req, res) {
            console.log('In baseController.baseFilter1');
        },
        function baseFilter2(req, res) {
            console.log('In baseController.baseFilter2');
        }
    ]
});

baseController.on('actionExecuting', function(req, res) {
    console.log('In baseController.actionExecuting');
    
    this.authUser = 'Dominic Pettifer';
});

baseController.on('actionExecuted', function(req, res) {
    console.log('In baseController.actionExecuted');
});

baseController.on('resultExecuting', function(req, res) {
    console.log('In baseController.resultExecuting');
});

baseController.on('resultExecuted', function(req, res) {
    console.log('In baseController.resultExecuted');
});

module.exports = baseController;