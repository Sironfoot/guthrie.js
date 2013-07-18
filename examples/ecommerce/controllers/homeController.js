var gu = require('../../..');
var baseController = require('./baseController.js');

var homeController = new gu.Controller({
    filters: [
        function filter1(req, res) {
            console.log('In homeController.filter1');
        },
        function filter2(req, res) {
            console.log('In homeController.filter2');
        }
    ]
});

homeController.prototype = baseController;

homeController.on('actionExecuting', function(req, res) {
    console.log('In homeController.actionExecuting');
});

homeController.on('actionExecuted', function(req, res) {
    console.log('In homeController.actionExecuted');
});

homeController.on('resultExecuting', function(req, res) {
    console.log('In homeController.resultExecuting');
});

homeController.on('resultExecuted', function(req, res) {
    console.log('In homeController.resultExecuted');
    
    console.log('AuthUser is: ' + this.authUser);
});

// PATH: /
homeController.index = {

    filters: [
        function actionFilter1(req, res) {
            console.log('In homeController.actionFilter1');
        },
        function actionFilter2(req, res) {
            console.log('In homeController.actionFilter2');
        }
    ],

    GET: function(req, res) {
    
        console.log(this.prototype.authUser);
    
        res.view();
    }
};

// PATH: /home/test
homeController.test = {
    
    GET: function(req, res) {
        res.view();
    }
}

module.exports = homeController;