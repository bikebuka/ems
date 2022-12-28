const models = require('../../models');
const AppResponseDto = require('../../dto/response/app.response.dto');
const _ = require('lodash');

function init(router) {
    router.param('unit_slug', async function (req, res, next) {
        req.query = {where:{shop_slug : req.params.shop_slug}};
        next();
    });

    router.param('unit_load_ids', async function (req, res, next, slugOrId) {
        const query = {attributes: ['id']};
        console.log(query)
        query.where = {id: slugOrId};

        await models.Unit.findOne(query)
            .then(unit => {
                console.log(unit)
                if (shop) {
                    req.shop = shop;
                    req.shop_id = shop.id;
                    return next();
                } else {
                    return res.status(404).json(AppResponseDto.buildWithErrorMessages('Shop does not exist'));
                }
            }).catch(err => {
                console.log(err)
                return res.json(AppResponseDto.buildWithErrorMessages(err.message));
            });
    });
}
