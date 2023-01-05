const models = require('../../models');
const AppResponseDto = require('../../dto/response/app.response.dto')
const {removeTicks} = require("sequelize/lib/utils");
const _ = require("lodash");
const PropertyResponseDto = require("../../dto/response/property.response.dto");
const Op = require('../../models/index').Sequelize.Op;

exports.rentUnit = async (req, res) => {
    const tenant_id = req.body.tenant_id;
    const unit_id = req.body.unit_id;
    //
    const deposit = req.body.deposit;
    const water_bill = req.body.water_bill;
    const electricity_bill = req.body.electricity_bill;
    const other_charges=req.body.other_charges
    const is_refundable=req.body.is_refundable

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
        tenant_id,
        unit_id,
        deposit,
        water_bill,
        electricity_bill,
        other_charges,
        is_refundable
    }).then(results => {
        models.Unit.update({is_rented: true}, {where: {id: unit_id}}).then(()=>{
            return res
                .status(200)
                .json({
                    success: true,
                    message: 'This unit has been rented out successfully',
                })
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
//get single unit
exports.getUnitByID = (req,res,next) => {
    let statement={where:{unit_id : req.params.id}};
    //
    const query = _.assign(statement, {
        include: [
            {
                model: models.Tenant,
                exclude: ['createdAt', 'updatedAt']
            },
            {
                model: models.Unit,
                exclude: ['createdAt', 'updatedAt']
            },
        ],
    });
    models
        .TenantUnit
        .findOne(query)
        .then(item => {
            if (item===null) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: 'No units found',
                    })
            }
            return res
                .status(200)
                .json({
                    success: true,
                    message: 'success',
                    data: item
                })
        }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err.message))
    })
}
