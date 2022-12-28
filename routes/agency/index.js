const router = require('express').Router();
const controller = require('../../controllers/agency/agency.controller');
const AuthMiddleware = require('../../middlewares/authentication.middleware');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
const upload = require('../../utils/upload.property').upload;
const setUploadPath = require('../../middlewares/upload.middleware').setUploadPath;
require('../param_loaders/agency.loader').init(router)

router.post('/register-agency', AuthenticationMiddleware, setUploadPath('./public/images/profile'), upload.array('images', 1),controller.registerAgency);
router.get('/search', AuthMiddleware, controller.getAgencies);
router.get('/paginated', AuthMiddleware, controller.getAllAgenciesPaginated);
router.get('/:agency_load_ids', AuthMiddleware, controller.getAgencyById)
router.get('/properties/:agency_id', AuthMiddleware, controller.getAgencyProperties);
router.post('/property/assign-agent', AuthMiddleware, controller.assignPropertyToAgent);
router.get('/get-agents/:id', AuthMiddleware, controller.getAgents)
router.get('/agents_no_pagination/:id', AuthMiddleware, controller.getAgentsNoPagination);
router.get('/get-profile/:id', AuthMiddleware, controller.getCompanyDetails);

module.exports = router
