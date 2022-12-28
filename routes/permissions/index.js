const router = require('express').Router();
const controller = require('../../controllers/user/permissions.controller');
const AuthenticationMiddleware = require('../../middlewares/authentication.middleware');
require('../param_loaders/permission.loader').init(router)

router.post('', AuthenticationMiddleware, controller.createPermission);
router.get('/by_id/:permission_id', AuthenticationMiddleware, controller.getPermissionByIdOrSlug)
router.get('/by_slug/:permission_slug', AuthenticationMiddleware, controller.getPermissionByIdOrSlug)
router.post('/assign-permission-to-role', AuthenticationMiddleware, controller.assignPermissionToRole);
router.get('/search', AuthenticationMiddleware, controller.getAllPermissionsNoPage);

module.exports = router;
