'use strict';

var assert = require('assert');
var express = require('express');
var gu = require('../../..');

describe('Config', function() {
    it('should throw an error if config is not initialised', function() {
        assert.throws(function() {
            gu.config.appSettings['test'];
        });
    });
    
    it('should return appSettings', function() {
        var app = express();
    
        gu.config.init({
            app: app,
            rootDir: __dirname
        });
        
        assert.equal(gu.config.appSettings['test1'], 'message1');
        assert.equal(gu.config.appSettings['test2'], 'message2');
    });
    
    it('should return connectionStrings', function() {
        var app = express();
    
        gu.config.init({
            app: app,
            rootDir: __dirname
        });
        
        assert.equal(gu.config.connectionStrings['test1'], 'connection1');
        assert.equal(gu.config.connectionStrings['test2'], 'connection2');
    });
    
    it('should return guthrie settings', function() {
        var app = express();
    
        gu.config.init({
            app: app,
            rootDir: __dirname
        });
        
        assert.equal(gu.config.guthrie.defaultDirectories.controllers, '/controllersTest');
        assert.equal(gu.config.guthrie.defaultDirectories.views, '/viewsTest');
        assert.equal(gu.config.guthrie.defaultDirectories.areas, '/areasTest');
        
        assert.equal(gu.config.guthrie.viewsExt, 'htmlTest');
        assert.equal(gu.config.guthrie.controllerNameAffix, 'ControllerTest');
        assert.equal(gu.config.guthrie.defaultAction, 'indexTest');
    });
        
    it('should return any custom config settings', function() {
        var app = express();
    
        gu.config.init({
            app: app,
            rootDir: __dirname
        });
        
        assert.equal(gu.config.custom.property1, 'value1');
        assert.equal(gu.config.custom.property2, 'value2');
        assert.equal(gu.config.custom.property3.length, 3);
        assert.equal(gu.config.custom.property3[0], 'arrayValue1');
    });
    
    describe('#package()', function() {
    
        it('should return the package.json settings if it exists', function() {
            var app = express();
        
            gu.config.init({
                app: app,
                rootDir: __dirname
            });
            
            var packageSettings = gu.config.package();
            
            assert.equal(packageSettings.name, 'name');
            assert.equal(packageSettings.description, 'description');
            assert.equal(packageSettings.keywords.length, 2);
            assert.equal(packageSettings.keywords[0], 'keyword1');
            assert.equal(packageSettings.version, 'version');
            assert.equal(packageSettings.author, 'author');
        });
    });
});