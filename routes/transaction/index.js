const router = require('express').Router();
const controller = require('../../controllers/transaction/transaction.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//add rent transaction
router.post('/pay-rent', AuthenticationMiddleware,controller.initiateRentTransaction);
module.exports = router
