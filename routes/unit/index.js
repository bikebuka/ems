const router = require('express').Router();
const controller = require('../../controllers/unit/unit.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//Add new unit
router.post('/create', AuthenticationMiddleware,controller.store);
//get all units
router.get('/', AuthenticationMiddleware,controller.index);
//get unit By ID
router.get('/:id', AuthenticationMiddleware,controller.show);

module.exports=router
