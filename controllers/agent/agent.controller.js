//Register an agent
const models = require("../../models");
const _ = require("lodash");
const Joi = require("joi");
const {Op} = require("sequelize");
//
//Agent schema
const agentSchema = Joi.object().keys({
    userId: Joi.number().required(),
    agencyId:Joi.number().required(),
});
//create an agent
exports.store= async  (req, res) =>{
    //request body
    const {body}=req;
    //
    const result=agentSchema.validate(body)
    const { value, error } = result;
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success:false,
                message: 'Invalid agent request',
                data: body
            })
    }
    // save
    try {
        //
        models
            .Agent
            .create(body)
            .then(agent => {
                //check if user has been created
                if (!agent) {
                    return res
                        .status(404)
                        .json({
                            success: false,
                            message: "Sorry! Agent was not added."
                        })
                }
                //
                return res
                    .status(201)
                    .json({
                        success: true,
                        message: "An account has been created successfully.",
                        data: agent
                    })
            })

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message:"Agent was not added.",
                error
            })
    }
}
//get agents
exports.index= (req,res) => {
    Promise.all([
        models.Agent.findAll({
            order:[
                'createdAt'
            ],
            include: [
                {
                    model:models.User,
                    as :'user'
                },
                {
                    model:models.Agency,
                    as:'agency'
                }
            ]
        }),
    ]).then(results=>{
        const data = results.shift();
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved the list of agents",
                data
            })
    }).catch(error=>{
        return res.status(500)
            .json({
                success: true,
                message:"Agents could not be retrieved",
                error
            })
    })
}
//assign property to an agent
exports.assignProperty = async (req, res) => {
    const {agency_id,agent_id,property_id}=req.body
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
                return res
                    .status(403)
                    .json({
                        success: false,
                        message:'Sorry.Property could not be assigned to this agent',
                        errors
                    })
            }
        }
        //
        models.AgentProperty.create({
            agent_id:agent_id,
            property_id: property_id
        }).then((results) => {
            return res
                .status(200)
                .json({
                    success: true,
                    message:'You have successfully assigned a property to an agent',
                    data: results
                })
        }).catch(error => {
            return res
                .status(500)
                .json({
                    success: false,
                    message:'Sorry.Property could not be assigned for this agent',
                    error
                })
        })
    }).catch(error => {
        return res
            .status(500)
            .json({
                success: false,
                message:'Sorry.Property could not be assigned for this agent',
                error
            })
    })
}
