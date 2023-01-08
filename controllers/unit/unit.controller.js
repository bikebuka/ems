const models =require('../../models');
const Joi = require("joi");

//property schema
const unitSchema = Joi.object().keys({
    propertyId: Joi.string().required(),
    name:Joi.string().required(),
    floor:Joi.string().required(),
    rentAmount: Joi.number().required(),
    bedrooms:Joi.number().required(),
    bathrooms:Joi.number().required(),
    totalRooms:Joi.number().required(),
    squareFoot:Joi.string().required(),
    isRented:Joi.boolean().required(),
    counter:Joi.number().required()
});
//add new property unit
exports.createUnit= (req,res) => {
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
exports.getUnits = (req,res) => {
    Promise.all([
        models.Unit.findAll({
            order:[
                'createdAt'
            ],
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
exports.getUnitById = (req, res) => {
    models.Unit.findOne({
        where: {id: req.params.id},
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
                message:"You have successfully retrieved an unit",
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
