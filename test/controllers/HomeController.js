var gu = require('../../');
var BaseController = require('./BaseController');

var HomeController = gu.controller.inherit(BaseController);

HomeController.actions = {
    index: {
        GET: function(req, res) {
            res.end();
        }
    }
}

module.exports = HomeController;