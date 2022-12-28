const router = require('express').Router();
const AuthMiddleware = require('../../middlewares/authentication.middleware')
const controller = require('../../controllers/landlord/landlord.controller')

router.post('', AuthMiddleware, controller.register);
router.get('/search', AuthMiddleware, controller.getOwners);
router.get('/paginated', AuthMiddleware, controller.getAllPaginated)

module.exports = router
