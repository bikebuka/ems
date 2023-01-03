const models = require('../../models');
const AppResponseDto = require('../../dto/response/app.response.dto');
const _ = require('lodash');

function init(router) {
    router.param('property_slug', async function (req, res, next) {
        req.query = {where:{property_slug : req.params.property_slug}};
        next();
    });

    router.param('slug', async function (req, res, next) {
        req.query = {where:{property_slug : req.params.slug}};
        next();
    });

    router.param('property_id', async function (req, res, next, slugOrId) {
        const query = {where:{id : req.params.property_id}};
        //query.where = {id: slugOrId};

        await models.Property.findOne(query)
            .then(property => {
                if (property) {
                    req.property = property;
                    req.property_id = property.id;
                    return next();
                } else {
                    return res.status(404).json(AppResponseDto.buildWithErrorMessages('Property does not exist'));
                }
            }).catch(err => {
                console.log(err)
                return res.json(AppResponseDto.buildWithErrorMessages(err.message));
            });
    });
}

module.exports = {
    init
}
