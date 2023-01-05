const models =require('../../models');
const AppResponseDto =  require('../../dto/response/app.response.dto');
const CountryResponseDto = require("../../dto/response/country.response.dto");
const CompanyResponseDto = require("../../dto/response/company.response.dto")
const UserRequestDto = require("../../dto/request/user.request.dto");
const CompanyRequestDto = require("../../dto/request/company.request.dto");
const _ = require("lodash");
const {sequelize} = require("../../models");
const AdminRegisterUserMailer = require("../../helpers/mailers/register.user.helper");
const PropertyResponseDto = require("../../dto/response/property.response.dto");
const Op = require('../../models/index').Sequelize.Op;
const AgentResponseDto = require('../../dto/response/agent.response.dto')

//current version to create an agency
exports.createAgency = (req,res) => {
    // check if
    try{
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
    const {agency_id,property_id}= req.body

    if (agency_id===null || property_id===null){
        return res.status(400)
            .json({
                success: false,
                message: 'Provide all the required fields'
            })
    }

    const property = await models.Property.findOne({where: {id: property_id}});
    //
    const agency = await models.Agency.findOne({where: {id: agency_id}});

    if(property===null || agency===null){
        return res
            .status(404)
            .json({
                success: false,
                message:'Property or agency not found'
            })
    }
    //update the agency
    try{
        property.agency_id=agency_id;
        await property.save();
        //
        return res
            .status(200)
            .json({
                success: false,
                message:'Property has been assigned to an agency successfully'
            })
    } catch (e) {
        return res
            .status(500)
            .json({
                success: false,
                message:'Property could not be assigned to an agency'
            })
    }

}
//assign property to an agent
exports.assignPropertyToAgent = async (req, res) => {
    const agent_id = req.body.agent_id;
    const property_id = req.body.property_id;

    if (!agent_id || !property_id) {
        res.status(400).send({error: 'You need a email and password'});
        return;
    }

    const property = await models.Property.findOne({where: {id: property_id}});
    debugger
    const agent = await models.Agent.findOne({where: {id: agent_id}, attributes: ['id', 'first_name', 'last_name', 'email_address', 'phone_number']});

    if(property.length < 1){
        res.status(400).send({error: 'Property not found'});
        return;
    }
    if(agent.length < 1){
        res.status(400).send({error: 'Agent not found'});
        return;
    }

    await models.AgentProperty.findOne({
        where: {
            [Op.and]: [{agent_id}, {property_id}]
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


exports.getAgencyProperties = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.Property.findAll({
            where: {agency_id: req.params.agency_id},
            offset: 0,
            limit: 5,
            order: [
                ['createdAt','DESC']
            ],
            attributes: ['id', 'property_name', 'property_slug', 'property_description', 'property_location', 'property_code','createdAt','updatedAt'],
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
            offset: (page - 1) * pageSize,
            limit: pageSize
        }),
        models.Property.findAndCountAll({attributes: ['id']})
    ]).then(results => {
        const property = results[0];
        const propertyCount = results[1].count;
        return res.json(PropertyResponseDto.buildPagedList(property, page, pageSize, propertyCount, req.baseUrl))
    }).catch(err => {
        res.json(AppResponseDto.buildWithErrorMessages(err.message));
    })
}

exports.getAgents = (req, res) => {
    let currentUser = req.params.id;

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.Agent.findAll({
            where: {agency_id: currentUser},
            offset: 0,
            limit: 5,
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                {
                    model: models.Users,
                    include:[{model: models.ProfilePicture}]
                }

            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        }),
        models.Agent.findAndCountAll({where:{agency_id: currentUser}, attributes: ['id']})
    ]).then(results => {
        const agents = results[0];
        const agentsCount = results[1].count

        return res.json(AgentResponseDto.buildPagedList(agents, page, pageSize, agentsCount, req.baseUrl))
    }).catch(err =>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getAgentsNoPagination  =(req, res) => {
    let currentUser = req.params.id;

    models.Agent.findAll({
        where: {agency_id: currentUser},
    }).then(result => {
        return res.json(AgentResponseDto.agentBasicDto(result));
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getCompanyDetails = (req, res) => {
    const currentUser = req.params.id;

    models.Users.findOne({
        where: {id: currentUser},
        include: [
            {
                model: models.Company
            },
            {
                model: models.ProfilePicture
            }
        ]
    }).then(results => {
        console.log(results)
        return res.json(CompanyResponseDto.companyDetails(results))
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}
