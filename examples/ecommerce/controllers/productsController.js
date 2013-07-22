var gu = require('../../..');
var BaseController = require('./baseController.js');

var ProductsController = gu.controller.inherit(BaseController);

// PATH: /products
ProductsController.index = {

	GET: function(req, res) {
		res.view();
	}
};

// PATH: /products/:id/:title
ProductsController.show = {

	GET: function(req, res) {
		res.view();
	}	
};

// PATH: /products/edit/:id
ProductsController.edit = {

	filters: [
		function isAuthorised(req, res) {

		}
	],
	
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

module.exports = ProductsController;
