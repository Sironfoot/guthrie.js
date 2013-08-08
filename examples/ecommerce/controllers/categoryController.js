'use strict';

var gu = require(__appRoot + '/../..');
var baseController = require('./baseController');
var db = require(__appRoot + '/lib/db');

var categoryController = gu.controller.inherit(baseController);

categoryController.actions = {
  
    // PATH: /category/[categoryId]
    show: {
        GET: function(req, res) {
            var categoryId = req.params.categoryId;
            var app = this.app;
            
            db.getCategory(app, categoryId, function(err, category) {
                if (err) throw err;
                
                db.getProductsInCategory(app, categoryId, function(err, products) {
                    if (err) throw err;
                    
                    res.view({ category: category, products: products });
                });
            });
        }
    }  
};

module.exports = categoryController;