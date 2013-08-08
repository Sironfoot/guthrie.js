'use strict';

var gu = require(__appRoot + '/../..');
var baseController = require('./baseController');
var db = require(__appRoot + '/lib/db');
var filters = require(__appRoot + '/lib/filters');

var accountController = gu.controller.inherit(baseController);

accountController.actions = {
    
    // PATH /account
    index: {
        filters: [ filters.loginRequired ],
        
        GET: function(req, res) {
            res.view();
        }
    },
    
    // PATH: /account/login
    login: {
        GET: function(req, res) {
            res.view();
        },
        POST: function(req, res) {
            var email = req.body.email;
            var password = req.body.password;
            
            db.findCutomerByEmail(this.app, email, function(err, customer) {
                if (err) throw err;
                
                if (customer && customer.password === password) {
                    req.session.authEmailId = customer.email;
                    res.redirect('/account');
                }
                else {
                    res.view({ notFound: true });
                }
            });
        }
    },
    
    // PATH: /account/logout
    logout: {
        POST: function(req, res) {
            req.session.destroy();
            res.redirect('/');
        }
    }
};

module.exports = accountController;