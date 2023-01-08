const router = require('express').Router();
const controller = require('../../controllers/property/property.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//Add new property
router.post('/create', AuthenticationMiddleware,controller.store);
//get all properties
router.get('/', AuthenticationMiddleware,controller.index);
//get property By ID
router.get('/:id', AuthenticationMiddleware,controller.show);
//upload image
router.post('/upload-image', AuthenticationMiddleware,controller.uploadPropertyImage);
//statistics
router.post('/statistics', AuthenticationMiddleware,controller.propertyStatistics);

module.exports=router
