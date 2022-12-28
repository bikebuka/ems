const express = require('express');
const router = express.Router();
const upload = require('../../utils/upload.property').upload;
const setUploadPath = require('../../middlewares/upload.middleware').setUploadPath;
const Controller = require('../../controllers/property/property.controller');
const AuthenticationMiddleware = require('../../middlewares/authentication.middleware');
require('../param_loaders/property.loader').init(router);

router.get('', AuthenticationMiddleware, Controller.getAll);
router.get('/:property_slug', AuthenticationMiddleware, Controller.getPropertyBySlugOrId);
router.get('/by_id/:property_id', AuthenticationMiddleware, Controller.getPropertyBySlugOrId)
router.post('/create', AuthenticationMiddleware,setUploadPath('./public/images/properties'), upload.array('images', 15), Controller.createProperty);
router.post('/create-owner', AuthenticationMiddleware, setUploadPath('./public/images/properties'), upload.array('images', 15), Controller.createPropertyOwner);
router.post('/create-agency', AuthenticationMiddleware, setUploadPath('./public/images/properties'), upload.array('images', 15), Controller.createPropertyAgency);

module.exports = router
