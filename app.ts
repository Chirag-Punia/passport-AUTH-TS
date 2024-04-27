import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';
import initializePassport from './config/passport';
import KEYS from './config/keys';
import router from './routes/index';
import userRouter from './routes/users';
const app = express();

// Passport Config


initializePassport(passport);

// DB Config
const db =KEYS.MongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db,
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables


// Routes
app.use('/', router);
app.use('/users', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => (`Server running on  ${PORT}`));