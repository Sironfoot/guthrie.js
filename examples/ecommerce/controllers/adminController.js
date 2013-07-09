var gu = require('guthrie');
var baseController = require('./baseController.js');

var adminController = new gu.Controller({
	filters: [
		function isAdmin(req, res, next) {
			next();
		}
	]
});

adminController.prototype = baseController;

// PATH: /admin
adminController.index = {
	
	GET: function(req, res) {
		res.render();
	}	
};

// PATH: /admin/orders
adminController.orders = {
	
	GET: function(req, res) {
		res.render();
	}
};

module.exports = adminController;