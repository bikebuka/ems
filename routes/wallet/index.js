const router = require('express').Router();
const controller = require('../../controllers/wallet/wallet.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//routes
//users
router.get('/account', AuthenticationMiddleware,controller.myAccount);
//
module.exports = router