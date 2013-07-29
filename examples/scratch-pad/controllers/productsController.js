var gu = require('../../..');
var BaseController = require('./baseController.js');

var ProductsController = gu.controller.inherit(BaseController);

ProductsController.actions = {

    // PATH: /products
    index: {
    	GET: function(req, res) {
    		res.view();
    	}
    },
    
    // PATH: /products/:id/:title
    show: {
    
    	GET: function(req, res) {
    		res.view();
    	}	
    },
    
    // PATH: /products/edit/:id
    edit: {
    
    	filters: [
    		function isAuthorised(req, res, next) {
                next();
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
    }
};

module.exports = ProductsController;
