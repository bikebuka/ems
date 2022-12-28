const router = require('express').Router();
const controller = require('../../controllers/tenant/tenant.controller');
const AuthMiddleware = require('../../middlewares/authentication.middleware');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
const upload = require('../../utils/upload.property').upload;
const setUploadPath = require('../../middlewares/upload.middleware').setUploadPath;


router.post('/register-tenant', AuthenticationMiddleware, setUploadPath('./public/images/profile'), upload.array('images', 1),controller.register);
router.get('/get-units', AuthMiddleware, controller.getMyUnits)
router.post('/pay-rent', AuthMiddleware, controller.payRent)
module.exports = router
