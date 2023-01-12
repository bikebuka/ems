const models =require('../../models');
const Joi = require("joi");

//property schema
const unitSchema = Joi.object().keys({
    propertyId: Joi.number(),
    tenantId: Joi.number(),
    name:Joi.string().required(),
    floor:Joi.string().required(),
    rentAmount: Joi.number().required(),
    bedrooms:Joi.number().required(),
    bathrooms:Joi.number().required(),
    totalRooms:Joi.number().required(),
    squareFoot:Joi.string().required(),
    isRented:Joi.boolean(),
    counter:Joi.number().required()
});
//Rent Out
const rentOutSchema=Joi.object().keys({
    unitId:Joi.number().required(),
    tenantId:Joi.number().required()
})

//add new property unit
exports.store= (req,res) => {
    // check if property
    try{
        //request body
        const {body}=req;
        //
        const result=unitSchema.validate(body)
        const {error } = result;
        console.log(error)
        //
        const valid = error == null;
        if (!valid) {
            return res.status(400)
                .json({
                    success:false,
                    message: 'Invalid property unit request',
                    data: body
                })
        }
        models.Unit.create(req.body)
            .then(result=>{
                if (result) {
                    return res
                        .status(201)
                        .json({
                            success: true,
                            message: "You have successfully added a unit",
                            data: result
                        });
                } else{
                    return res
                        .status(500)
                        .json({
                            success: false,
                            message: 'A unit could not be created, something went wrong',
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
                            message: 'A unit could not be created',
                            error:err
                        })
                }
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: 'A unit could not be created',
                error
            })
    }

}
//get all units
exports.index = (req,res) => {
    Promise.all([
        models.Unit.findAll({
            order:[
                'createdAt'
            ],
            include:[
                {
                    model:models.Property,
                    as:'property',
                    include: [
                        {
                            model: models.Agency,
                            as: 'agency'
                        },
                        {
                            model: models.Agent,
                            as: 'agent',
                            include: [
                                {
                                    model:models.User,
                                    as:'user'
                                }
                            ]
                        },
                    ]
                }
            ]
        }),
    ]).then(results=>{
        const data = results.shift();
        //
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved the list of units",
                data
            })
    }).catch(error=>{
        return res
            .status(500)
            .json({
                success: false,
                message: 'A property could not be retrieved',
                error
            })
    })
}
//single unit
exports.show = (req, res) => {
    models.Unit.findOne({
        where: {id: req.params.id},
        include:[
            {
                model:models.Tenant,
                as:'tenant',
                include:[
                    {
                        model:models.User,
                        as: 'user'
                    }
                ]
            },
            {
                model:models.Property,
                as:'property',
                include: [
                    {
                        model: models.Agency,
                        as: 'agency'
                    },
                    {
                        model: models.Agent,
                        as: 'agent',
                        include: [
                            {
                                model:models.User,
                                as:'user'
                            }
                        ]
                    },
                ]
            }
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
                message:"You have successfully retrieved a unit",
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
// Rent Out
exports.rentOut = async (req, res) => {
    const {body} = req;
    //
    const result = rentOutSchema.validate(body)
    const {value, error} = result;
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success: false,
                message: 'Invalid rent out request',
                data: body
            })
    }
    try {
        const {unitId,tenantId}=body
        const unit = await models.Unit.findOne({
            where: {id: unitId}
        });

        await unit.update({tenantId,isRented:true});
        //
        return res.status(200)
            .json({
                success: true,
                message: 'You have successfully rented out this unit.'
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: 'Ensure that the provided details are correct.',
                error
            })
    }
}
