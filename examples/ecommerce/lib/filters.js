exports.loginRequired = function(req, res, next) {
    
    if (!res.authUser) {
        res.redirect('/account/login');
    }
    else {
        next();
    }
};