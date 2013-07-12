var gu = require('../../..');

var baseController = new gu.Controller();

baseController.on('actionExecuting', function(req, res) {
    res.write('In baseController.actionExecuting');
});

module.exports = baseController;