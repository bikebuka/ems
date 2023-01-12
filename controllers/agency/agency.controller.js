const models =require('../../models');
const AppResponseDto =  require('../../dto/response/app.response.dto');
const _ = require("lodash");
const Joi = require("joi");
const Op = require('../../models/index').Sequelize.Op;

//Agency schema
const agencySchema = Joi.object().keys({
    name: Joi.string().required(),
    telephone:Joi.string().required(),
    description: Joi.string().required(),
    emailAddress:Joi.string().email().required(),
    address:Joi.string().required(),
    websiteURL:Joi.string(),
    country:Joi.string(),
    avatar:Joi.string(),
});
//assign property to agency
const agencyAssignmentSchema=Joi.object().keys({
    agencyId:Joi.number().required(),
    propertyId:Joi.number().required()
})
exports.createAgency = (req,res) => {
    // check if
    try{
        //request body
        const {body}=req;
        //
        const result=agencySchema.validate(body)
        const {error } = result;
        //
        const valid = error == null;
        if (!valid) {
            return res.status(400)
                .json({
                    success:false,
                    message: 'Invalid agency request',
                    data: body
                })
        }
        models.Agency.create(req.body)
            .then(result=>{
                if (result) {
                    return res
                        .status(201)
                        .json({
                            success: true,
                            message: "You have successfully added an agency",
                            data: result
                        });
                } else{
                    return res
                        .status(500)
                        .json({
                            success: false,
                            message: 'An agency could not be created, something went wrong',
                        })
                }
            })
            .catch(err=>{
                if (err.name === 'SequelizeValidationError' || err.name==='SequelizeUniqueConstraintError') {
                    return res.status(400).json({
                        success: false,
                        message: (err.errors.shift().message)
                    })
                }

                else {
                    return res
                        .status(500)
                        .json({
                            success: false,
                            message: 'An agency could not be created',
                            error:err
                        })
                }
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: 'An agency could not be created',
                error
            })
    }

}
//get all agencies
exports.getAgencies = (req,res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.Agency.findAll({
            order:[
                'createdAt'
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize,
        }),
        models.Agency.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        console.log(results)
        const agencies = results.shift();
        const count = results.shift().count;
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved the list of agencies",
                data: agencies
            })
    }).catch(err=>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}
//single agency
exports.getAgencyById = (req, res) => {
    models.Agency.findOne({
        where: {id: req.params.id},
        include: [
            {
                model: models.Agent,
                as: 'agents',
                include: [
                    {
                        model:models.User,
                        as:'user'
                    }
                ]
            },
            {
                model: models.Property,
                as:'properties',
                include: [
                    {
                        model:models.Agent,
                        as:'agent',
                        include:[
                            {
                                model:models.User,
                                as: 'user'
                            }
                        ]
                    },
                    {
                        model:models.PropertyImage,
                        as:'images'
                    },
                    {
                        model:models.Unit,
                        as:'units'
                    }
                ]
            },
        ]
    }).then((agency) => {
        //
        if (agency===null) {
            return res.status(404)
                .json({
                    success: false,
                    message:"No agency found with the provided ID",
                })
        }
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved an agency",
                data: agency
            })
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err.message))
    })
}
//assign property to agency
exports.assignPropertyToAgency = async (req, res) => {
    //request body
    const {body}=req;
    //
    const result=agencyAssignmentSchema.validate(body)
    const {error } = result;
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success:false,
                message: 'Invalid agency assignment request',
                data: body
            })
    }
    //
    const {agencyId,propertyId}=body
    //
    const property = await models.Property.findOne({where: {id: propertyId},attributes:['id','agencyId']});
    //
    const agency = await models.Agency.findOne({where: {id: agencyId},attributes:['id']});
    //
    if(property===null || agency===null){
        return res
            .status(404)
            .json({
                success: false,
                message:'Property or agency not found'
            })
    }
    // the agency
    try{
        property.agencyId=agencyId;
        await property.save();
        //
        return res
            .status(200)
            .json({
                success: true,
                message:'Property has been assigned to an agency successfully'
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message:'Property could not be assigned to an agency',
                error
            })
    }
}
//agency properties
exports.getAgencyProperties = (req, res) => {
    Promise.all([
        models.Agency.findOne({
            where: {id: req.params.agencyId},
            include: [
                {
                    model: models.Property,
                    as:'properties',
                    include: [
                        {
                            model:models.Agent,
                            as:'agent',
                            include:[
                                {
                                    model:models.User,
                                    as: 'user'
                                }
                            ]
                        },
                        {
                            model:models.PropertyImage,
                            as:'images'
                        },
                        {
                            model:models.Unit,
                            as:'units'
                        }
                    ]
                },
            ],
        }),
    ]).then(results => {
       if (results) {
           return res
               .status(200)
               .json({
                   success: true,
                   message:'You have successfully retrieved agency properties',
                   data: results.shift()
               })
       } else{
           return res
               .status(404)
               .json({
                   success: false,
                   message: 'Sorry! We could not retrieve any property for this agency'
               })
       }
    }).catch(error => {
        return res
            .status(500)
            .json({
                success: false,
                message:'Sorry. No property could be retrieved for this agency',
                error
            })
    })
}
