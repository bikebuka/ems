const router = require('express').Router();
const controller = require('../../controllers/property/property.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//Add new property
router.post('/create', AuthenticationMiddleware,controller.createProperty);
//get all properties
router.get('/', AuthenticationMiddleware,controller.getProperties);
//get property By ID
router.get('/:id', AuthenticationMiddleware,controller.getPropertyById);

module.exports=router
