'use strict';

var gu = require(__appRoot + '/../..');
var adminBaseController = require('./adminBaseController.js')

var homeController = gu.controller.inherit(adminBaseController);

homeController.actions = {
    
    // PATH: /admin
    index: {
        GET: function(req, res, next) {
            res.view();
        }
    }
};

module.exports = homeController;