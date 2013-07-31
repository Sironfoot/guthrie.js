'use strict';

var gu = require('../../..');
var baseController = require('./baseController');
var db = require('../lib/db');

var ordersController = gu.controller.inherit(baseController);

ordersController.actions = {
    
    // PATH: /orders
    index: {
        GET: function(req, res) {
            res.view();
        }
    }
};

module.exports = ordersController;