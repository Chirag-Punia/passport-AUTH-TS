import express ,{Request,Response}from "express";

const router = express.Router();
import middle  from "../config/auth";
router.get("/", (req:Request,res:Response) => {
    res.render("welcome");
})
router.get("/dashboard",middle.ensureAuthenticated ,(req:Request,res:Response) => {
    res.render("dashboard");
})

export default router;