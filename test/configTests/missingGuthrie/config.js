'use strict';

var assert = require('assert');
var express = require('express');
var gu = require('../../..');

describe('Config', function() {
    it('should return default guthrie settings if guthrie section is missing', function() {
        var app = express();
    
        gu.config.init({
            app: app,
            rootDir: __dirname
        });
        
        assert.equal(gu.config.guthrie.defaultDirectories.controllers, '/controllers');
        assert.equal(gu.config.guthrie.defaultDirectories.views, '/views');
        assert.equal(gu.config.guthrie.defaultDirectories.areas, '/areas');
        
        assert.equal(gu.config.guthrie.viewsExt, '');
        assert.equal(gu.config.guthrie.controllerNameAffix, 'Controller');
        assert.equal(gu.config.guthrie.defaultAction, 'index');
    });

    describe('#package()', function() {
        if('should return null if package.json is missing', function() {
            var app = express();
    
            gu.config.init({
                app: app,
                rootDir: __dirname
            });
            
            var packageSettings = gu.config.package();
            assert.ok(!packageSettings);
        });
    });
});