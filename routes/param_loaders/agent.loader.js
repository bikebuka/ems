const AppResponseDto = require('../../dto/response/app.response.dto');
const models = require('../../models')

function init(router) {
    router.param('agent_load_ids', function (req, res, next, id) {
        models.Agent.findOne({
            where: {agency_id: id}
        }).then((agency) => {
            if(!agency){
                return res.json(AppResponseDto.buildWithErrorMessages('Agent not found'))
            }
            req.agency = agency;
            req.userOwnable = agency;
            next();
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages(err.message));
        })
    })
}

module.exports = {
    init
}
