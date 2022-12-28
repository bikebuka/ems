const router = require('express').Router();
const authController = require('../../controllers/mpesa/auth/auth');
const lipaNaMpesa = require('../../controllers/mpesa/lipanampesa/lipaNaMPesa')

router.post('/authenticate', authController.fetchToken);
router.post('/stkPush', lipaNaMpesa.postTransaction)
module.exports = router
