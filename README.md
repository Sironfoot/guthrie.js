guthrie.js
==========

A Node.js MVC framework built on Express.js, inspired by Microsoft's ASP.NET MVC.

Guthrie organises your code into controllers and actions and supports filters and events. You can think of a controller
as nouns for something (product, category, order) and actions as verbs (show, edit, remove).

## Installation

    $ npm install express
    $ npm install guthrie

## Quick Start

Add it to an existing Express.js app:

````javascript

var express = require('express');
var gu = require('guthrie');

var app = express();
//... insert middleware
app.use(app.router);

var router = new gu.Router(app, __dirname);

router.mapRoute('/', {
    controller: 'home',
    action: 'index'
});

router.mapRoute('/product/:id/:name', {
    controller: 'product',
    action: 'detail'
});

http.createServer(app).listen(3000);
````

This will create routes for two controllers, 'home' and 'product'. Each can have one
or more 'actions'. For instance, we have mapped the '/' path to the 'home' controller and the 'index' action.

Lets create the home Controller. By convension, controllers must appear in the '/controllers' directory in your app's
root directory, and the file name must be affixed with 'Controller.js'. So create a 'homeController.js' file in the
'/controllers' directory.

````javascript

var gu = require('guthrie');

var homeController = gu.controller.create();
homeController.actions = {
    
    // PATH: /
    index: {
        GET: function(req, res) {
            res.view();
        }
    }
};

module.exports = homeController;
````

res.view() is a helper method that works the same as res.render(), except it assumes the view is located in
'/views/controllerName/actionName'. So in our above example, it will look for '/views/home/index.html'.

## More on Routes

When defining routes you can include the controller and action as parameters within the route itself:

    router.mapRoute('/product/:action/:id', { controller: 'product' });

So the URL '/product/edit/123' will match the 'product' controller and the 'edit' action. In fact the pattern
'/controller/action/id' is a common one so you can simply define one route to cover all your controllers/actions with:

    router.mapRoute('/:controller/:action?/:id?');

Notice the question mark on action indicating that it's optional. The action name will default to 'index', so the
URL '/product' will map to the 'index' action in the 'product' controller.

**WARNING**: By default, express(1) puts the router middleware before the static middleware, so the above route will
match all your scripts and stylesheets, so remember to change the order:

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);

## Actions Filters

Action Filters provide reusable functionality for common tasks (checking authorisation for instance).
They can be placed on controllers and will run for all actions in that controller, or on individual
actions. To place on a controller:

````javascript

var accountController = gu.controller.create({
    filters: [ filters.mustBeLoggedIn ]
});
````

To place on an individual action:

````javascript

var accountController = gu.controller.create();
accountController.actions = {
    
    // PATH: /account/login
    login: {
        GET: function(req, res) {
            res.view();
        }
    }
    
    // PATH: /account/orders
    orders: {
        filters: [ filters.mustBeLoggedIn ],
        
        GET: function(req, res) {
            res.view();
        }
    }
};
````

Lets look at the implentation for 'mustBeLoggedIn':

````javascript

exports.mustBeLoggedIn = function(req, res, next) {
    
    if (!res.session.loggedInUser) {
        res.redirect('/account/login');
    }
    else {
        next();
    }
};
````

Filters work just like connect middleware. You can define multiple filters per controller and action.
They will be executed in series and before any actions are run. Because they are called one after the other,
you must remember to call the next() function to indicate that the next filter should run, unless you want to
stop processing at that point and send a result to the browser (see the res.redirect() example above).


## Events

Controllers support 4 standard events:

* actionExecuting - called before any action is executed
* actionExecuted - called after any action is executed
* resultExecuting - called before the result is executed
* resultExecuted - called after the result is executed

A 'result' is defined as any method on the HttpResponse object that sends a result to the browser,
for instance res.end(), res.render(), res.view(), res.redirect() etc.

````javascript

var homeController = gu.controller.create();

homeController.on('actionExecuting', function(req, res, next) {
    // Do something for all actions in the home controller
    next();
});
````

Like Filters, Events also behave like Connect middleware and are called in series, so remember to call next().


## Controller Inheritance

You can create a base controller, and have all other controllers inherit from it.

````javascript

var baseController = new gu.controller.create();
module.exports = baseController;
````

````javascript

var baseController = require('./baseController');

var homeController = new gu.controller.inherit(baseController, {
    filters: [ /* optional filters */ ]
});
````

Controller Inheritance is useful for defining Events and Action Filters that run for all controller/actions in the
application. For instance, it'a common for a web app to have a base/root layout template (or partial views) that contains
some form of database derived output repeated for every page in the website. An ecommerce app might have a list of
categories on the left side in every page for instance. Rather than repeat the categories data access code in every action,
you could put it in the base controller:

````javascript

var baseController = new gu.controller.create();

baseController.on('actionExecuting', function(req, res, next) {
    db.getCategories(function(err, categories) {
        if (err) throw err;
    
        res.locals.categories = categories;
        next();
    });
});

module.exports = baseController;
````

If you ensure every controller inherits from base controller, every template in the web application
will have a categories property pre-populated.

## Coming Soon

* Support for Areas
* Web.config files
* Model Validation (maybe)


## License 

(The MIT License)

Copyright (c) 2013 Dominic Pettifer &lt;sironfoot@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
