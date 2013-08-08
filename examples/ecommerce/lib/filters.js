exports.loginRequired = function(req, res, next) {
    
    if (!this.authUser) {
        res.redirect('/account/login');
    }
    else {
        next();
    }
};

exports.adminOnly = function(res, res, next) {
    if (this.authUser && this.authUser.isAdmin) {
        next();
    }
    else {
        res.redirect('/');
    }
};