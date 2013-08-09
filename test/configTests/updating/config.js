'use strict';

var assert = require('assert');
var express = require('express');
var fs = require('fs');
var path = require('path');
var gu = require('../../..');

describe('Config', function() {

    it('should auto reload settings when web.json file is updated', function(done) {
        var app = express();
    
        gu.config.init({
            app: app,
            rootDir: __dirname
        });
        
        assert.equal(gu.config.appSettings['test1'], 'message1');
        assert.equal(gu.config.appSettings['test2'], 'message2');
        
        var filePath = path.join(__dirname, 'web.json');
        
        fs.readFile(filePath, function(err, data) {
            if (err) throw err;
            
            var originalData = data.toString();
            
            var config = JSON.parse(originalData);
            config.appSettings.test1 = 'updatedMessage1';
            config.appSettings.test2 = 'updatedMessage2';
            
            var json = JSON.stringify(config);
            
            fs.writeFile(filePath, json, function(err) {
                if (err) throw err;
                
                // Give it a moment to update
                setTimeout(function() {
                    assert.equal(gu.config.appSettings['test1'], 'updatedMessage1');
                    assert.equal(gu.config.appSettings['test2'], 'updatedMessage2');
                    
                    fs.writeFile(filePath, originalData, function(err) {
                        if (err) throw err;
                        
                        dont(); 
                    });
                }, 200);
            })
        });
    });

});