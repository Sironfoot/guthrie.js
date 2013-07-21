var gu = require('../../..');
var BaseController = require('./baseController.js');

var HomeController = gu.controller.inherit(BaseController, {
    filters: [
        function filter1(req, res, next) {
            console.log('In homeController.filter1');
            next();
        },
        function filter2(req, res, next) {
            console.log('In homeController.filter2');
            next();
        }
    ]
});

HomeController.on('actionExecuting', function(req, res, next) {
    console.log('In homeController.actionExecuting');
    next();
});

HomeController.on('actionExecuted', function(req, res, next) {
    console.log('In homeController.actionExecuted');
    next();
});

HomeController.on('resultExecuting', function(req, res, next) {
    console.log('In homeController.resultExecuting');
    next();
});

HomeController.on('resultExecuted', function(req, res, next) {
    console.log('In homeController.resultExecuted');
    next();
});

// PATH: /
HomeController.index = {

    filters: [
        function actionFilter1(req, res, next) {
            console.log('In homeController.actionFilter1');
            next();
        },
        function actionFilter2(req, res, next) {
            console.log('In homeController.actionFilter2');
            next();
        }
    ],

    GET: function(req, res) {
        res.view();
    }
};

// PATH: /home/test
HomeController.test = {
    
    GET: function(req, res) {
        res.view();
    }
}

module.exports = HomeController;