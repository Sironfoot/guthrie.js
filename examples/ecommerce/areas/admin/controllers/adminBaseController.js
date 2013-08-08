var gu = require(__appRoot + '/../..');
var baseController = require(__appRoot + '/controllers/baseController.js');
var filters = require(__appRoot + '/lib/filters');

var adminBaseController = gu.controller.inherit(baseController, {
    filters: [ filters.adminOnly ]
});

module.exports = adminBaseController;