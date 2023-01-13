const router = require('express').Router();
const controller = require('../../controllers/wallet/wallet.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//routes
//users
router.get('/account/:id', AuthenticationMiddleware,controller.myAccount);
//send to agent
router.get('/send-to-agent', AuthenticationMiddleware,controller.sendToAgent);
//top up my account
router.post('/top-up', AuthenticationMiddleware,controller.topUpMyAccount);
//
module.exports = router
