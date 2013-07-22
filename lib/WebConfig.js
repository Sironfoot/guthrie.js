var fa = require('fs');
var path = require('path');

var WebConfig = function(app, rootDir, options) {
    this.app = app;
    this.rootDir = rootDir;
};

WebConfig.prototype.connectionStrings = function() {

    var webConfigPath = path.join(this.rootDir, 'web.json');

    var jsonData = fs.readFileSync(webConfigPath, { encoding: 'utf-8' });
};