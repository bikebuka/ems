const router = require('express').Router();
const controller = require('../../controllers/unit/unit.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//Add new unit
router.post('/create', AuthenticationMiddleware,controller.createUnit);
//get all units
router.get('/', AuthenticationMiddleware,controller.getUnits);
//get unit By ID
router.get('/:id', AuthenticationMiddleware,controller.getUnitById);

module.exports=router
