import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Strategy as LocalStrategy } from 'passport-local';
import userSchema from '../models/user';

const user = mongoose.model('user', userSchema);


const initializePassport = (passport:any) => {
    passport.use(
        new LocalStrategy({usernameField : "email"},(email,password,done) => {
            user.findOne({email : email}).then(user => {
                if(!user){
                    return done(null,false,{message : "User not registered"});

                }

                //Math password
                bcrypt.compare(password,user.password,(err,isMatch) => {
                    if(err){
                        throw err
                    }
                    if(isMatch){
                        return done(null,user)
                    }
                    else{
                        return done(null,false,{message: "password is incorrect"})
                    }
                })
            })
    })
    );

    passport.serializeUser(function(user:any, cb:any) {
        process.nextTick(function() {
            return cb(null, user.id);
        });
    });

    passport.deserializeUser(function(user:any, cb:any) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
};

export default initializePassport;