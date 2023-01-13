const router = require('express').Router();
const controller=require("../../controllers/auth/auth.controller")
//register account
router.post("/create-account",controller.createAccount)
//login user
router.post("/login",controller.login)
//
module.exports=router
