var gu = require('../..');

var baseController = new gu.Controller();

baseController.on('actionExecuting', function(req, res, next) {
    res.write('In baseController.actionExecuting');
    next();
});

module.exports = baseController;