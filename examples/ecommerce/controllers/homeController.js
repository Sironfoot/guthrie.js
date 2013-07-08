var gu = require('guthrie');

var homeController = new gu.Controller();

homeController.on('actionExecuting', function(req, res, next) {
	next();
});

homeController.on('actionExecuted', function(req, res, next) {
	next();
});

// Prob not possible
homeController.on('resultExecuting', function(req, res, next) {
	next();
});

// Prob not possible
homeController.on('resultExecuted', function(req, res, next) {
	next();
});

// PATH: /
homeController.index = {
	
	GET: function(req, res) {
		res.view();
	}
};

module.exports = homeController;