var gu = require('../../..');

var baseController = new gu.Controller({
    filters: [
        function baseFilter1(req, res) {
            res.write('In baseController.baseFilter1\n');
        },
        function baseFilter2(req, res) {
            res.write('In baseController.baseFilter2\n');
        }
    ]
});

baseController.on('actionExecuting', function(req, res) {
    res.write('In baseController.actionExecuting\n');
});

baseController.on('actionExecuted', function(req, res) {
    res.write('In baseController.actionExecuted\n');
});

baseController.on('resultExecuting', function(req, res) {
    res.write('In baseController.resultExecuting\n');
});

baseController.on('resultExecuted', function(req, res) {
    res.write('In baseController.resultExecuted\n');
});

module.exports = baseController;