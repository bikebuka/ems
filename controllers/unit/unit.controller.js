const models = require('../../models');
const AppResponseDto = require('../../dto/response/app.response.dto')
const {removeTicks} = require("sequelize/lib/utils");
const Op = require('../../models/index').Sequelize.Op;

exports.rentUnit = async (req, res) => {
    const tenant_id = req.body.tenant_id;
    const unit_id = req.body.unit_id;

    if(!tenant_id || !unit_id){
        res.status(400).send({error:'Please provide a tenant and a unit'});
        return;
    }

    const unit = await models.Unit.findOne({where: {id: unit_id}});
    const tenant = await models.Tenant.findOne({where: {id: tenant_id}});

    if(!unit){
        res.status(400).send({error:'Unit not found'});
        return;
    }

    // if(!tenant){
    //     res.status(400).send({error:'Tenant not found'});
    //     return;
    // }

    models.TenantUnit.create({
        tenant_id: tenant_id,
        unit_id: unit_id
    }).then(results => {
        models.Unit.update({is_rented: true}, {where: {id: unit_id}}).then(()=>{
            return res.json(AppResponseDto.buildSuccessWithMessages('Unit rented successfully'))
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages(err))
        })
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getTenantUnits = (req, res) => {
    const currentUser = req.user.id;

    models.TenantUnit.findAll({
        where: {
            [Op.and]: [{tenant_id: currentUser},{current_owner: true}]
        },
        include: [
            {model: models.Unit}
        ]
    }).then(results => {
        console.log(results)
    }).catch(err=> {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}
