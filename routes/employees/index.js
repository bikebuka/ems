const router = require('express').Router();
const controller = require('../../controllers/employee/employee.controller');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//routes
//users
router.get('/', AuthenticationMiddleware,controller.index);
//one user
router.get('/:id', AuthenticationMiddleware,controller.show);
//
module.exports = router
