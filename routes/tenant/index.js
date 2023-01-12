const router = require('express').Router();
const controller = require('../../controllers/tenant/tenant.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//add tenant
router.post('/create', AuthenticationMiddleware,controller.store);
//tenants
router.get('/', AuthenticationMiddleware,controller.index);
//
module.exports = router
