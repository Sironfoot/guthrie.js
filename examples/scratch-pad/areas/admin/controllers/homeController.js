var gu = require('../..');

var homeController = new gu.Controller();

// PATH: /admin
homeController.index = {
    
    GET: function(req, res) {
        res.render();
    }  
};

module.exports = homeController;