const router = require('express').Router();
const controller = require('../../controllers/agent/agent.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//add agent
router.post('/create', AuthenticationMiddleware,controller.store);
//agents
router.get('/', AuthenticationMiddleware,controller.index);
//
router.patch('/assign-property', AuthenticationMiddleware,controller.update);
//
module.exports = router
