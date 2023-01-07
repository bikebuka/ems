const router = require('express').Router();
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
const controller=require("../../controllers/auth/auth.controller")
//register account
router.post("/create-account",controller.createAccount)
//login user
router.post("/login",controller.login)
//
module.exports=router
