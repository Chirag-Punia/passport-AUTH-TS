"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_local_1 = require("passport-local");
const user_1 = __importDefault(require("../models/user"));
const user = mongoose_1.default.model('user', user_1.default);
const initializePassport = (passport) => {
    passport.use(new passport_local_1.Strategy({ usernameField: "email" }, (email, password, done) => {
        user.findOne({ email: email }).then(user => {
            if (!user) {
                return done(null, false, { message: "User not registered" });
            }
            //Math password
            bcryptjs_1.default.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, { message: "password is incorrect" });
                }
            });
        });
    }));
    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user.id);
        });
    });
    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });
};
exports.default = initializePassport;
