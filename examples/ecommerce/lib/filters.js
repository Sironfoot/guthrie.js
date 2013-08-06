exports.loginRequired = function(req, res, next) {
    
    if (!this.authUser) {
        res.redirect('/account/login');
    }
    else {
        next();
    }
};