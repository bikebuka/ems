const router = require('express').Router();
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
const controller=require("../../controllers/auth/auth.controller")

router.post("/create-account",controller.createAccount)

//
module.exports=router
