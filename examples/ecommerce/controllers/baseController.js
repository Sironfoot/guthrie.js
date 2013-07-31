var gu = require('../../..');
var db = require('../lib/db');

var baseController = gu.controller.create();

baseController.on('actionExecuting', function(req, res, next) {

    var self = this;
    
    db.getCategories(self.app, function(err, categories) {
        if (err) throw err;
        self.viewbag(res).categories = categories;
        
        var authEmailId = req.session.authEmailId;
        
        if (authEmailId) {
            db.findCutomerByEmail(self.app, authEmailId, function(err, customer) {
                if (err) throw err;
                
                if (customer) {
                    res.authUser = customer;
                    self.viewbag(res).authUser = customer;
                }
                
                next();
            });
        }
        else {     
            next();
        }
    });
});

module.exports = baseController;