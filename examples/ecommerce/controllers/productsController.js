var gu = require('guthrie');

var productsController = new gu.Controller();

// PATH: /products
productsController.index = {

	GET: function(req, res) {
		res.view();
	}
};

// PATH: /products/:id/:title
productsController.show = {

	GET: function(req, res) {
		res.view();
	}	
};

// PATH: /products/edit/:id
productsController.edit = {

	filters: [
		function isAuthorised(req, res, next) {
			next();
		}
	]
	
	GET: function(req, res) {
		res.view();
	},
	
	POST: function(req, res) {
		res.view();
	},
	
	PUT: function(req, res) {
		res.view();
	},
	
	DELETE: function(req, res) {
		res.view();
	}
};

module.exports = productsController;