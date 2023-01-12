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
//assignment
const agentAssignmentSchema=Joi
    .object().keys({
        agencyId:Joi.number().required(),
        agentId:Joi.number().required(),
        propertyId:Joi.number().required(),
    })
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
exports.update = async (req, res) => {
    //request body
    const {body}=req;
    //
    const result=agentAssignmentSchema.validate(body)
    const { value, error } = result;
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success:false,
                message: 'Invalid agent assignment request',
                data: body
            })
    }
    //check if property exists
    try{
        const {agencyId,propertyId,agentId}=body
        //
        const property = await models.Property.findOne({where: {id: propertyId},attributes:['id']});
        //check if agent exists
        const agent = await models.Agent.findOne({where: {id: agentId},attributes:['id']});
        //check if agency exists
        const agency = await models.Agency.findOne({where: {id: agencyId},attributes:['id']});
        //
        if (!property || !agent  || !agency ) {
            return res.status(404)
                .json({
                    success: false,
                    message:'Ensure that the provided details are correct.'
                })
        } else{
            //
            if (agency.id===agencyId && property.id===propertyId) {
                //
                const property = await models.Property.findOne({
                    where: { id: propertyId }
                });

                await property.update({ agentId: agentId });
                //
                return res.status(200)
                    .json({
                        success: false,
                        message:'You have successfully assigned an agent to this property.'
                    })
            } else{
                return res.status(400)
                    .json({
                        success: false,
                        message:'Sorry. We could not assign this property to an agent'
                    })
            }
            //
        }
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message:'Ensure that the provided details are correct.',
                error
            })
    }

}
