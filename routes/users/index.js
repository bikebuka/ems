const router = require('express').Router();
const upload = require('../../utils/upload.profile').upload
const setUploadPath = require('../../middlewares/upload.middleware').setUploadPath;
const controller = require('../../controllers/user/user.controller');
const AuthenticationMiddleware = require('../../middlewares/authentication.middleware');

router.post('', controller.register);
router.post('/login', controller.login)
router.post('/register-user', AuthenticationMiddleware, setUploadPath('./public/images/profile'), upload.array('images', 1), controller.adminRegisterUser);
router.get('/confirm/:ehash',controller.confirm);
router.post('/refresh-token', controller.refreshUserToken);
router.get('/logout', controller.logout)


module.exports = router;
