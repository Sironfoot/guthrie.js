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

                    req.session.basket.forEach(function(item) {
                        var product = products.filter(function(product) {
                            return product.id === item.productId;
                        })[0];
                        
                        if (product) {
                            items.push({ product: product, quantity: item.quantity });
                        }
                    });
                    
                    res.view({ items: items });
                });
            }
            else {
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
        
            var productId = req.body.productId;
            var basket = req.session.basket;
            
            if (basket) {
                req.session.basket = basket.filter(function(item) {
                    return item.productId !== productId;
                });
            }
        
            res.redirect('/basket');
        }
    },
    
    empty: {
        POST: function(req, res) {
            req.session.basket = [];
            res.redirect('/basket')
        }
    }
};

module.exports = basketController;