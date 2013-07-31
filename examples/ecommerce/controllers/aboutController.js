'use strict';

var gu = require('../../..');
var baseController = require('./baseController');

var aboutController = gu.controller.inherit(baseController);

aboutController.actions = {
    
    // PATH: /about
    index: {
        GET: function(req, res) {
            res.view();
        }
    },
    
    // PATH: /about/contact
    contact: {
        GET: function(req, res) {
            res.view();
        }
    },
    
    //PATH: /about/legal
    legal: {
        GET: function(req, res) {
            res.view();
        }
    },
    
    //PATH /about/terms
    terms: {
        GET: function(req, res) {
            res.view();
        }
    }
};

module.exports = aboutController;