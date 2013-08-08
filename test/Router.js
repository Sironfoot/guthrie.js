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
        assert.equal(app.gu.rootDir, rootDir, '.rootDir is missing or incorrect')
        assert.equal(app.gu.controllersDir, controllersDir, '.controllersDir is missing or incorrect');
        assert.equal(app.gu.viewsDir, viewsDir, '.viewsDir is missing or incorrect');
    });
    
    describe('#createArea', function() {
        it('should set areas collection on express app instance', function() {
            var app = {};
            app.get = function() {
                return 'html';
            }
            
            var rootDir = __dirname;
        
            var areaName = 'admin';
            var areaDir = path.join(rootDir, 'areas', areaName)
            var controllersDir = path.join(areaDir, 'controllers');
            var viewsDir = path.join(areaDir, 'views');
        
            var router = new gu.Router(app, rootDir);
            var area = router.createArea(areaName);
            
            var areaInfo = app.gu.areas[areaName];
            
            assert.ok(areaInfo);
            assert.equal(areaInfo.dir, areaDir);
            assert.equal(areaInfo.controllersDir, controllersDir);
            assert.equal(areaInfo.viewsDir, viewsDir);
        });
    });
});