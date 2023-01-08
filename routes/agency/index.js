const router = require('express').Router();
const controller = require('../../controllers/agency/agency.controller');
const AuthMiddleware = require('../../middlewares/authentication.middleware');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
//new version
router.post('/create', AuthenticationMiddleware,controller.createAgency);
//agencies
router.get('/', AuthenticationMiddleware,controller.getAgencies);
//agency
router.get('/:id', AuthenticationMiddleware,controller.getAgencyById);
//assign property to agency
router.patch('/assign-property', AuthenticationMiddleware,controller.assignPropertyToAgency);
//agency properties
router.get('/:agencyId/properties', AuthMiddleware, controller.getAgencyProperties);
//register an agent
// router.post('/register-agent', AuthMiddleware, controller.registerAgent);
// //assign to agent
// router.post('/agents/assign-property',AuthMiddleware,controller.assignPropertyToAgent)
//
module.exports = router
