const router = require('express').Router();
const controller = require('../../controllers/statistics/statistics.controller');
const AuthMiddleware = require('../../middlewares/authentication.middleware');

router.get('/admin-vacant-units', AuthMiddleware, controller.getVacantUnits);
router.get('/admin-rented-units', AuthMiddleware, controller.getRentedUnits);
router.get('/admin-expected-amount', AuthMiddleware, controller.getExpectedRent);
router.get('/admin-collected-amount', AuthMiddleware, controller.getPaidAmount);

router.get('/agency-vacant-units', AuthMiddleware, controller.getAgencyVacantUnits);
router.get('/agency-rented-units', AuthMiddleware, controller.getAgencyRentedUnits);
router.get('/agency-expected-rent', AuthMiddleware, controller.getAgencyExpectedRent);

module.exports = router
