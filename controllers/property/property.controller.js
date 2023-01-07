const models =require('../../models');
const Joi = require("joi");

//property schema
const propertySchema = Joi.object().keys({
    userId: Joi.string().required(),
    agencyId:Joi.string(),
    totalUnits:Joi.string().required(),
    name: Joi.string().required(),
    title:Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string(),
    status:Joi.string(),
});
exports.createProperty= (req,res) => {
    // check if property
    try{
        //request body
        const {body}=req;
        //
        const result=propertySchema.validate(body)
        const {error } = result;
        //
        const valid = error == null;
        if (!valid) {
            return res.status(400)
                .json({
                    success:false,
                    message: 'Invalid property request',
                    data: body
                })
        }
        models.Property.create(req.body)
            .then(result=>{
                if (result) {
                    return res
                        .status(201)
                        .json({
                            success: true,
                            message: "You have successfully added a property",
                            data: result
                        });
                } else{
                    return res
                        .status(500)
                        .json({
                            success: false,
                            message: 'A property could not be created, something went wrong',
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
                            message: 'An property could not be created',
                            error:err
                        })
                }
            })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: 'A property could not be created',
                error
            })
    }

}
//get all properties
exports.getProperties = (req,res) => {
    Promise.all([
        models.Property.findAll({
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
                message:"You have successfully retrieved the list of properties",
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
//single agency
exports.getPropertyById = (req, res) => {
    models.Property.findOne({
        where: {id: req.params.id},
    }).then((property) => {
        //
        if (property===null) {
            return res.status(404)
                .json({
                    success: false,
                    message:"No property found with the provided ID",
                })
        }
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved an property",
                data: property
            })
    }).catch(error => {
        return res
            .status(500)
            .json({
                success: false,
                message: 'A property could not be retrieved',
                error
            })
    })
}
