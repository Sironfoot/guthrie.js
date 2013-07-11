var gu = require('../..');

var homeController = new gu.Controller({
    filters: [
        function filter1(req, res, next) {
            res.write('In homeController.filter1\n');
            next();
        },
        function filter2(req, res, next) {
            res.write('In homeController.filter2\n');
            next();
        }
    ]
});

homeController.on('actionExecuting', function(req, res, next) {
    res.write('In homeController.actionExecuting\n');
    next();
});

homeController.on('actionExecuted', function(req, res, next) {
    res.write('In homeController.actionExecuted\n');
    next();
});

// Prob not possible
homeController.on('resultExecuting', function(req, res, next) {
    res.write('In homeController.resultExecuting');
    next();
});

// Prob not possible
homeController.on('resultExecuted', function(req, res, next) {
    res.write('In homeController.resultExecuted');
    next();
});

// PATH: /
homeController.index = {

    GET: function(req, res) {
        res.end('In homeController.index.GET');
    }
};

module.exports = homeController;