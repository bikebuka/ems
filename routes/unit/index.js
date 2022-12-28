const router = require('express').Router();
const controller = require('../../controllers/unit/unit.controller');
const AuthMiddleware = require('../../middlewares/authentication.middleware');

router.post('/rent-out', AuthMiddleware, controller.rentUnit)
router.get('/tenant-units', AuthMiddleware, controller.getTenantUnits)

module.exports = router
