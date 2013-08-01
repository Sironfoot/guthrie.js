'use strict';

var gu = require('../../..');
var baseController = require('./baseController');
var db = require('../lib/db');
var filters = require('../lib/filters');

var basketController = gu.controller.inherit(baseController, {
    filters: [ filters.loginRequied ]
});

basketController.actions = {

    // PATH: /basket
    index: {
        GET: function(req, res) {
        
            if (req.session.basket && req.session.basket.length > 0) {
                db.getProducts(this.app, function(err, products) {
                    if (err) throw err;
                    
                    var items = [];
                    
                    console.log(req.session.basket[0].productId);
                    
                    req.session.basket.forEach(function(item) {
                        var product = products.filter(function(product) {
                            return product.productId === item.productId;
                        })[0];
                        
                        console.log(product);
                        
                        if (product) {
                            items.push({ product: product, quantity: item.quantity });
                        }
                    });
                    
                    //console.log(items.length);
                    res.view({ items: items });
                });
            }
            else {
                //console.log('here 2');
                res.view();
            }
        }
    },
    
    // PATH: /basket/add
    add: {
        POST: function(req, res) {
        
            var productId = req.body.productId;
        
            var basket = req.session.basket || [];
            
            var existingItem = basket.filter(function(item) {
                return item.productId === productId;
            })[0];
            
            if (!existingItem) {
                existingItem = { productId: productId, quantity: 0 };
                basket.push(existingItem);
            }
            
            existingItem.quantity++;
            
            req.session.basket = basket;
        
            res.redirect('/basket');
        }
    },
    
    // PATH: /basket/remove
    remove: {
        POST: function(req, res) {
            res.redirect('/');
        }
    }
};

module.exports = basketController;