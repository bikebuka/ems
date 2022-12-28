const models = require('../../models');
const AppResponseDto = require('../../dto/response/app.response.dto');
const _ = require('lodash');

function init(router) {
    router.param('permission_slug', (req, res, next, slug) => {
        req.query = {where: {permission_slug: req.params.permission_slug}}
        next();
    });

    router.param('permission_id', (req, res, next, slugOrId) => {
        const query = {where: {id: req.params.permission_id}}
        next();
    })

}

module.exports = {
    init
}