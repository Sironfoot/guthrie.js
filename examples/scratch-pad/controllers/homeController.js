var gu = require('../../..');
var BaseController = require('./baseController.js');

var HomeController = gu.controller.inherit(BaseController, {
    filters: [
        function filter1(req, res, next) {
            console.log('In homeController.filter1');
            setTimeout(next, 10);
        },
        function filter2(req, res, next) {
            console.log('In homeController.filter2');
            setTimeout(next, 10);
        }
    ]
});

HomeController.on('actionExecuting', function(req, res, next) {
    console.log('In homeController.actionExecuting');
    setTimeout(next, 10);
});

HomeController.on('actionExecuted', function(req, res, next) {
    console.log('In homeController.actionExecuted');
    setTimeout(next, 10);
});

HomeController.on('resultExecuting', function(req, res, next) {
    console.log('In homeController.resultExecuting');
    setTimeout(next, 10);
});

HomeController.on('resultExecuted', function(req, res, next) {
    console.log('In homeController.resultExecuted');
    setTimeout(next, 10);
});

HomeController.actions = {

    // PATH: /
    index: {
        filters: [
            function actionFilter1(req, res, next) {
                console.log('In homeController.actionFilter1');
                setTimeout(next, 10);
            },
            function actionFilter2(req, res, next) {
                console.log('In homeController.actionFilter2');
                setTimeout(next, 10);
            }
        ],
    
        GET: function(req, res) {
            console.log('Executing Action');
            res.view();
        }
    },
    
    // PATH: /home/test
    test: {
        GET: function(req, res) {
            res.json(200, { user: 'Domdom' });
        }
    }
};

module.exports = HomeController;