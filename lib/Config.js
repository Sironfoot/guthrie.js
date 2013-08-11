var fs = require('fs');
var path = require('path');

var fileWatcher = null;

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

var Config = function() { };

function loadDefaultGuthrieSettings() {
    this.guthrie = this.guthrie || {};
    
    this.guthrie.defaultDirectories = this.guthrie.defaultDirectories ||
        guthrieSettings.defaultDirectories;
        
    this.guthrie.viewsExt = this.guthrie.viewsExt ||
        guthrieSettings.viewsExt;
    this.guthrie.controllerNameAffix = this.guthrie.controllerNameAffix ||
        guthrieSettings.controllerNameAffix;
    this.guthrie.defaultAction = this.guthrie.defaultAction ||
        guthrieSettings.defaultAction;
}

function configFileChanged(config, configPath) {
    fileWatcher.close();

    fs.readFile(configPath, { encoding: 'utf8' }, function(err, data) {
            
        Object.keys(config).forEach(function(key) {
            delete config[key];
        });

        var configData = JSON.parse(data);

        Object.keys(configData).forEach(function(key) {
            config[key] = configData[key];
        });
        
        loadDefaultGuthrieSettings.call(config);
        
        fileWatcher = fs.watch(configPath, { persistent: false }, function() {
            configFileChanged(config, configPath);
        });
    });
}

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
        
        Object.keys(configData).forEach(function(key) {
            config[key] = configData[key];
        });
        
        fileWatcher = fs.watch(configPath, { persistent: false }, function() {
            configFileChanged(config, configPath);
        });
    }
    
    loadDefaultGuthrieSettings.call(config);
};

module.exports = new Config();