const router = require('express').Router();
const controller = require('../../controllers/rent/rent.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//add rent
router.post('/create', AuthenticationMiddleware,controller.store);
//rent history
router.get('/', AuthenticationMiddleware,controller.index);
//show unit rent hsitory
router.get('/units/:id/history', AuthenticationMiddleware,controller.show);
//
module.exports = router
