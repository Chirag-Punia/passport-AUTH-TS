import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import express,{Response,Request,NextFunction} from 'express';
import passport from 'passport';
import userSchema, {Ischema} from '../models/user';
import { HydratedDocument } from 'mongoose';

const user = mongoose.model<Ischema>('user', userSchema);
const userRouter = express.Router();


userRouter.get("/login", (req:Request,res:Response) => {
    res.render("login");
});
userRouter.get("/register", (req:Request,res:Response) => {
    res.render("register");
});
userRouter.post("/register",(req:Request,res:Response) =>{
    let {name,email,password,password2} = req.body;
    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({msg : "Enter all required field"})
    }
    if(password !== password2){
        errors.push({msg : "Password did not match"})
    }
    if(password.length < 6){
        errors.push({msg : "Password should be at least 6 characters"})
    }
    if (errors.length > 0){
        res.render("register",{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else {
        user.findOne({email : email}).then(user => {
            if(user){
                errors.push({msg : "User already exist"});
                res.render("register",{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else {
                let newUser: HydratedDocument<Ischema> = new (user as any)({
                    name: name,
                    email: email,
                    password: password
                });
                console.log(newUser);
                //hash password
                bcrypt.genSalt(10,(err,salt) => {
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user => {
                                res.redirect("/users/login");
                            })
                            .catch(err => console.log(err))
                    })
                })
            }
            }
        )
    }

});

//login handle
userRouter.post('/login', (req:Request, res:Response, next:NextFunction) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
userRouter.get('/logout', (req:Request, res:Response,next:NextFunction) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/users/login');
    });
});

export default userRouter;