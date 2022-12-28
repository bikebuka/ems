const router = require('express').Router();
const controller = require('../../controllers/agent/agent.controller');
const AuthMiddleware = require('../../middlewares/authentication.middleware');
const AuthenticationMiddleware = require("../../middlewares/authentication.middleware");
const upload = require('../../utils/upload.property').upload;
const setUploadPath = require('../../middlewares/upload.middleware').setUploadPath;
require('../param_loaders/agent.loader').init(router)

router.post('/register-agent', AuthenticationMiddleware, setUploadPath('./public/images/profile'), upload.array('images', 1),controller.register);
router.post('/register-agent-agency', AuthenticationMiddleware, setUploadPath('./public/images/profile'), upload.array('images', 1),controller.agencyRegisterAgent);
// router.get('/search', AuthMiddleware, controller.getAgencies);
// router.get('/paginated', AuthMiddleware, controller.getAllAgenciesPaginated);
router.get('/get_by_id/:agent_load_ids', AuthMiddleware, controller.getAgentsByAgencyId)

module.exports = router
