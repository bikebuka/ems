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
    agencyId:Joi.string().required(),
    propertyId:Joi.string().required()
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
                success: false,
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
//Register an agent
exports.registerAgent= async  (req,res) =>{
    // check if
    try{
        models.Agent.create(req.body)
            .then(result=>{
                if (result) {
                    return res
                        .status(201)
                        .json({
                            success: true,
                            message: "You have successfully added an agent",
                            data: result
                        });
                } else{
                    return res
                        .status(500)
                        .json({
                            success: false,
                            message: 'An agent could not be created, something went wrong',
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
                            message: 'An agent could not be created',
                            error:err
                        })
                }
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: 'An agent could not be created',
                error
            })
    }
}
//assign property to an agent
exports.assignPropertyToAgent = async (req, res) => {
    const {agency_id,agent_id,property_id}=req.body
    console.log("******************")
    console.log(req.body)
    console.log("******************")

    if (!agent_id || !property_id  || !agency_id===null ) {
        return res.status(400)
            .json({
                success: false,
                message:'Provide all the required fields'
            })
    }
    //check if property exists
    try{
        const property = await models.Property.findOne({where: {id: property_id},attributes:['id']});
        //check if agent exists
        const agent = await models.Agent.findOne({where: {id: agent_id},attributes:['id']});
        //check if agency exists
        const agency = await models.Agency.findOne({where: {id: agency_id},attributes:['id']});
        //
        if (!property || !agent  || !agency ) {
            return res.status(404)
                .json({
                    success: false,
                    message:'Ensure that the provided details are correct.'
                })
        }
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message:'Ensure that the provided details are correct.',
                error
            })
    }

    await models.AgencyProperty.findOne({
        where: {
            [Op.and]: [{agent_id}, {property_id}, {agency_id}]
        }
    }).then((details) => {
        if(details){
            const errors = {};
            errors.detail = 'Property is already assigned to agent'
            if (!_.isEmpty(errors)) {
                return res.status(403).json(AppResponseDto.buildWithErrorMessages(errors));
            }
        }
        models.AgentProperty.create({
            agent_id:agent_id,
            property_id: property_id
        }).then((results) => {
            return res.json(AppResponseDto.buildSuccessWithMessages('Property assigned successfully to an agent'))
        }).catch(err => {
            res.json(AppResponseDto.buildWithErrorMessages(err.message));
        })
    }).catch(err => {
        res.json(AppResponseDto.buildWithErrorMessages(err.message));
    })
}
//agency properties
exports.getAgencyProperties = (req, res) => {
    Promise.all([
        models.Property.findAll({
            where: {agency_id: req.params.agency_id},
            order: [
                ['createdAt','DESC']
            ],
            include: [
                {
                    model: models.Users,
                    exclude: ['createdAt', 'updatedAt']
                },
                {
                    model: models.Country,
                    exclude: ['createdAt', 'updatedAt']
                },
                {
                    model: models.Category
                },
                {
                    model: models.PropertyImage
                },
                {
                    model: models.Unit,
                    include: [{model: models.UnitType}]
                },
                {
                    model: models.Company
                }
            ],
            offset: 0,
            limit: 5
        }),
    ]).then(results => {
       if (results) {
           return res
               .status(200)
               .json({
                   success: true,
                   message:'You have successfully retrieved agency properties',
                   data: results
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
