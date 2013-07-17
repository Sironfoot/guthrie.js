var gu = require('../../..');
var baseController = require('./baseController.js');

var homeController = new gu.Controller({
    filters: [
        function filter1(req, res) {
            res.write('In homeController.filter1\n');
        },
        function filter2(req, res) {
            res.write('In homeController.filter2\n');
        }
    ]
});

homeController.prototype = baseController;

homeController.on('actionExecuting', function(req, res) {
    res.write('In homeController.actionExecuting\n');
});

homeController.on('actionExecuted', function(req, res) {
    res.write('In homeController.actionExecuted\n');
});

homeController.on('resultExecuting', function(req, res) {
    res.write('In homeController.resultExecuting\n');
});

homeController.on('resultExecuted', function(req, res) {
    res.write('In homeController.resultExecuted\n');
});

// PATH: /
homeController.index = {

    filters: [
        function actionFilter1(req, res) {
            res.write('In homeController.actionFilter1\n');
        },
        function actionFilter2(req, res) {
            res.write('In homeController.actionFilter2\n');
        }
    ],

    GET: function(req, res) {
        res.end('In homeController.index.GET\n');
    }
};

module.exports = homeController;