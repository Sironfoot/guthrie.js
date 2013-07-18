'use strict';

var EventEmitter = require('events').EventEmitter;

var Controller = function(options) {
	options = options || {};
	this.filters = options.filters || [];
};

Controller.prototype = Object.create(EventEmitter.prototype);

Controller.prototype.setApp = function(app) {
    Controller.prototype.app = app;
};

module.exports = Controller;