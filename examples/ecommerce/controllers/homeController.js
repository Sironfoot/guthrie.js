var gu = require('../../..');
var baseController = require('./baseController');

var homeController = gu.controller.inherit(baseController);

homeController.actions = {
    
    // PATH: /
    index: {
        GET: function(req, res) {
            res.view();
        }
    }
};

module.exports = homeController;