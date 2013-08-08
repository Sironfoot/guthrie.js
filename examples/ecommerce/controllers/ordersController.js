'use strict';

var gu = require(__appRoot + '/../..');
var baseController = require('./baseController');
var db = require(__appRoot + '/lib/db');
var filters = require(__appRoot + '/lib/filters');

var ordersController = gu.controller.inherit(baseController, {
    filters: [ filters.loginRequired ]
});

ordersController.actions = {
    
    // PATH: /orders
    index: {
        GET: function(req, res) {
            res.view();
        }
    },
};

module.exports = ordersController;