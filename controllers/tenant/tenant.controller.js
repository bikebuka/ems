//Register an agent
const models = require("../../models");
const _ = require("lodash");
const Joi = require("joi");
const {Op} = require("sequelize");
//
//Agent schema
const tenantSchema = Joi.object().keys({
    userId: Joi.number().required(),
    unitId:Joi.number().required(),
});
//create an agent
exports.store= async  (req, res) =>{
    //request body
    const {body}=req;
    //
    const result=tenantSchema.validate(body)
    const { value, error } = result;
    console.log(value)
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success:false,
                message: 'Invalid tenant request',
                data: body
            })
    }
    // save
    try {
        //
        models
            .Tenant
            .create(body)
            .then(tenant => {
                //check if user has been created
                if (!tenant) {
                    return res
                        .status(404)
                        .json({
                            success: false,
                            message: "Sorry! Tenant was not added."
                        })
                }
                //
                return res
                    .status(201)
                    .json({
                        success: true,
                        message: "Tenant account has been created successfully.",
                        data: tenant
                    })
            })
            .catch(error=>{
                return res
                    .status(500)
                    .json({
                        success: false,
                        message:"Tenant was not added.",
                        error
                    })
            })

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message:"Tenant was not added.",
                error
            })
    }
}
//get agents
exports.index= (req,res) => {
    Promise.all([
        models.Tenant.findAll({
            order:[
                'createdAt'
            ],
            include: [
                {
                    model:models.User,
                    as :'user'
                },
                {
                    model:models.Unit,
                    as:'unit'
                }
            ]
        }),
    ]).then(results=>{
        const data = results.shift();
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved the list of tenants",
                data
            })
    }).catch(error=>{
        return res.status(500)
            .json({
                success: true,
                message:"Tenants could not be retrieved",
                error
            })
    })
}
