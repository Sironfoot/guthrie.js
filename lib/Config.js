var fs = require('fs');
var path = require('path');

var guthrieSettings = {

    defaultDirectories : {
        controllers: '/controllers',
        views: '/views',
        areas: '/areas'
    },
    
    viewsExt: '',
    controllerNameAffix: 'Controller',
    defaultAction: 'index'
};

var Config = function() {
    
};



Config.prototype.init = function(options) {

    var config = this;
    
    Object.keys(config).forEach(function(key) {
        delete config[key];
    });

    this.app = options.app;
    this.rootDir = options.rootDir;
    
    var configPath = path.join(this.rootDir, 'web.json');
    
    var configExists = fs.existsSync(configPath);
    
    if (configExists) {
        var json = fs.readFileSync(configPath, { encoding: 'utf8' });
        
        var configData = JSON.parse(json);
        
        var config = this;
        
        Object.keys(configData).forEach(function(key) {
            config[key] = configData[key];
        });
    }
    
    this.guthrie = this.guthrie || {};
    
    this.guthrie.defaultDirectories = this.guthrie.defaultDirectories ||
        guthrieSettings.defaultDirectories;
        
    this.guthrie.viewsExt = this.guthrie.viewsExt ||
        guthrieSettings.viewsExt;
    this.guthrie.controllerNameAffix = this.guthrie.controllerNameAffix ||
        guthrieSettings.controllerNameAffix;
    this.guthrie.defaultAction = this.guthrie.defaultAction ||
        guthrieSettings.defaultAction;
};

module.exports = new Config();