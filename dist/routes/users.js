"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../models/user"));
const user = mongoose_1.default.model('user', user_1.default);
const userRouter = express_1.default.Router();
userRouter.get("/login", (req, res) => {
    res.render("login");
});
userRouter.get("/register", (req, res) => {
    res.render("register");
});
userRouter.post("/register", (req, res) => {
    let { name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Enter all required field" });
    }
    if (password !== password2) {
        errors.push({ msg: "Password did not match" });
    }
    if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters" });
    }
    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        user.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: "User already exist" });
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else {
                let newUser = new (mongoose_1.default.model("user", user_1.default))({
                    name: name,
                    email: email,
                    password: password
                });
                console.log(newUser);
                //hash password
                bcryptjs_1.default.genSalt(10, (err, salt) => {
                    bcryptjs_1.default.hash(newUser.password, salt, (err, hash) => {
                        if (err)
                            throw err;
                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user => {
                            res.redirect("/users/login");
                        })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});
//login handle
userRouter.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});
// Logout
userRouter.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/users/login');
    });
});
exports.default = userRouter;
