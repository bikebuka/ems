const models = require('../../models');
const AppResponseDto = require('../../dto/response/app.response.dto');
const Op = require('../../models/index').Sequelize.Op;

function init(router) {
    router.param('identifier', async function (req, res, next) {
        req.query = {where: {[Op.or]: [{slug: req.params.identifier},{id: req.params.identifier}]}}
        next();
    })
}

module.exports = {
    init
}
