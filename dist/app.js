"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_session_1 = __importDefault(require("express-session"));
const passport_2 = __importDefault(require("./config/passport"));
const keys_1 = __importDefault(require("./config/keys"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
// Passport Config
(0, passport_2.default)(passport_1.default);
// DB Config
const db = keys_1.default.MongoURI;
// Connect to MongoDB
mongoose_1.default
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
// EJS
app.use(express_ejs_layouts_1.default);
app.set('view engine', 'ejs');
// Express body parser
app.use(express_1.default.urlencoded({ extended: true }));
// Express session
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// Passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Connect flash
app.use((0, connect_flash_1.default)());
// Global variables
// Routes
app.use('/', index_1.default);
app.use('/users', users_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => (`Server running on  ${PORT}`));
