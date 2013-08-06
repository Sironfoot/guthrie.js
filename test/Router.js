'use strict';

var assert = require('assert');
var path = require('path');
var gu = require('../');


describe('Router', function() {
    it('should set properties on express app instance', function() {

        var app = {};
        app.get = function() {
            return 'html';
        }
        
        var rootDir = __dirname;
        var controllersDir = path.join(rootDir, 'controllers');
        var viewsDir = path.join(rootDir, 'views');
        
        var router = new gu.Router(app, rootDir);
        
        assert.ok(app.gu, '.gu property is missing');
        assert.equal(app.gu.controllersDir, controllersDir, '.controllersDir property is missing or incorrect');
        assert.equal(app.gu.viewsDir, viewsDir, '.viewsDir property is missing or incorrect');
    });
});
