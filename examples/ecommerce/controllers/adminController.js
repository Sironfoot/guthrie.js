var gu = require('guthrie');

var adminController = new gu.Controller({
	filters: [
		function isAdmin(req, res, next) {
			next();
		}
	]
});

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