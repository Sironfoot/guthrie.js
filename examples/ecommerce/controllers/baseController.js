var gu = require('guthrie');

var baseController = new gu.Controller();

baseController.on('actionExecuting', function(req, res, next) {
	next();
});

module.exports = baseController;