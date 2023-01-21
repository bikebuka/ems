const models = require("../../models");
const _ = require("lodash");
const Joi = require("joi");
const {Op} = require("sequelize");
//
//Rent schema
const rentSchema = Joi.object().keys({
    unitId: Joi.number().required(),
    tenantId:Joi.number().required(),
    amountPaid:Joi.number().required(),
});
//create rent
exports.store= async  (req, res) =>{
    //request body
    const {body}=req;
    //
    const result=rentSchema.validate(body)
    const { value, error } = result;
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success:false,
                message: 'Invalid rent request',
                data: body
            })
    }
    // save
    try {
        //
        models
            .Rent
            .create(body)
            .then(rent => {
                //check if user has been created
                if (!rent) {
                    return res
                        .status(404)
                        .json({
                            success: false,
                            message: "Sorry! Rent was not added."
                        })
                }
                //
                return res
                    .status(201)
                    .json({
                        success: true,
                        message: "Payment was successfully recorded",
                        data: rent
                    })
            })

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message:"Rent was not recorded.",
                error
            })
    }
}
//get agents
exports.index= (req,res) => {
    Promise.all([
        models.Rent.findAll({
            order:[
                'createdAt'
            ],
            include: [
                {
                    model:models.Unit,
                    as :'unit'
                },
                {
                    model:models.Tenant,
                    as :'tenant',
                    include: [
                        {
                            model:models.User,
                            as: 'user'
                        }
                    ]
                },
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

//single unit
exports.show = (req, res) => {
    models.Rent.findAll({
        //
        where: {unitId: req.params.id},
        //
        include:[
            {
                model:models.Unit,
                as :'unit'
            },
            {
                model:models.Tenant,
                as :'tenant',
                include: [
                    {
                        model:models.User,
                        as: 'user'
                    }
                ]
            },
        ]
    }).then((unit) => {
        //
        if (unit===null) {
            return res.status(404)
                .json({
                    success: false,
                    message:"No unit found with the provided ID",
                })
        }
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved a unit rental history",
                data: unit
            })
    }).catch(error => {
        return res
            .status(500)
            .json({
                success: false,
                message: 'A unit could not be retrieved',
                error
            })
    })
}

