var fs = require('fs');
var path = require('path');

function getCategories(app, callback) {
    var filePath = path.join(app.get('rootDir'), 'db', 'categories.json');
    
    fs.readFile(filePath, { encoding: 'utf8' }, function(err, data) {

        var categories = !err ? JSON.parse(data.toString()) : [];
        callback(err, categories)
    });
}

function getProducts(app, callback) {
    var filePath = path.join(app.get('rootDir'), 'db', 'products.json');
    
    fs.readFile(filePath, { encoding: 'utf8' }, function(err, data) {
        
        var products = !err ? JSON.parse(data.toString()) : [];
        callback(err, products) 
    });
}

function getProductsInCategory(app, categoryId, callback) {
    getProducts(app, function(err, products) {
        var categoryProducts = [];
    
        if (!err) {}
            categoryProducts= products.filter(function(product) {
                return product.categoryId === categoryId;
            });
        }
        
        callback(err, categoryProducts);
    });
}

function getCustomers(app, callback) {
    var filePath = path.join(app.get('rootDir'), 'db', 'customers.json');
    
    fs.readFile(filePath, { encoding: 'utf8' }, function(err, data) {
        
        var customers = !err ? JSON.parse(data.toString()) : [];
        callback(err, customers) 
    });
}

function findCutomerByEmail(app, email, callback) {
    getCustomers(app, function(err, customers) {
        var customer = null;
        
        if (!err) {
            var found = customers.filter(function(cust) {
                return cust.email === email;
            });
            
            if (found.length > 0) {
                customer = found[0];
            }
        }
        
        callback(err, customer);
    });
}



exports.getCategories = getCategories;
exports.getProducts = getProducts;
exports.getProductsInCategory = getProductsInCategory;
exports.getCustomers = getCustomers;
exports.findCutomerByEmail = findCutomerByEmail;