"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../config/auth"));
router.get("/", (req, res) => {
    res.render("welcome");
});
router.get("/dashboard", auth_1.default.ensureAuthenticated, (req, res) => {
    res.render("dashboard");
});
exports.default = router;
