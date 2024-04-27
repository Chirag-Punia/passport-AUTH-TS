import { Response,Request,NextFunction } from "express";
const middle = {
    ensureAuthenticated: function(req:Request, res:Response, next:NextFunction) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/users/login');
    },
    forwardAuthenticated: function(req:Request, res:Response, next:NextFunction) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    }
};

export default middle;