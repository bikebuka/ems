const models =require('../../models');
const Joi = require("joi");
const fs=require("fs")
//
const base64Image=require("base64-img")
const sharp = require('sharp');

//property schema
const propertySchema = Joi.object().keys({
    userId: Joi.number().required(),
    agencyId:Joi.number(),
    agentId:Joi.number(),
    totalUnits:Joi.number().required(),
    name: Joi.string().required(),
    title:Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string(),
    status:Joi.string(),
});
//
const imageUploadSchema = Joi.object().keys({
    propertyId:Joi.number().required(),
    base64:Joi.string().required()
})
exports.store= (req,res) => {
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
//upload property images
exports.uploadPropertyImage= (req,res) => {
    const {base64,propertyId}=req.body
    // check if property
    try{
        //request body
        const {body}=req;
        //
        const result=imageUploadSchema.validate(body)
        const {error } = result;
        //
        const valid = error == null;
        if (!valid) {
            return res.status(400)
                .json({
                    success:false,
                    message: 'Invalid property image upload request',
                    data: body
                })
        }
        //

        const imageURL = 'public/images/properties/'+Date.now()+'.png'
        // to convert base64 format into random filename
        const base64Data = base64.replace(/^data:([A-Za-z-+/]+);base64,/, '');

        fs.writeFileSync(imageURL, base64Data,  {encoding: 'base64'});

        //save
        const data={
            imageURL,
            propertyId
        }
        models.PropertyImage.create(data)
            .then(result=>{
                if (result) {
                    //save to (property property image model)
                    models.PropertyPropertyImage.create({
                        propertyId,
                        propertyImageId: result.id
                    })
                    //
                    return res
                        .status(201)
                        .json({
                            success: true,
                            message: "You have successfully added a property image",
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
exports.index = (req,res) => {
    Promise.all([
        models.Property.findAll({
            order:[
                'createdAt'
            ],
            include:[
                {
                    model:models.Agency,
                    as :'agency'
                },
                {
                    model:models.Agent,
                    as:'agent',
                    include:[
                        {
                            model:models.User,
                            as:'user'
                        }
                    ]
                },
                {
                    model:models.PropertyImage,
                    as :'images'
                },
                {
                    model: models.Unit,
                    as:'units'
                },
            ]
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
exports.show = (req, res) => {
    models.Property.findOne({
        where: {id: req.params.id},
        include:[
            {
                model:models.Agency,
                as :'agency'
            },
            {
                model:models.Agent,
                as:'agent',
                include:[
                    {
                        model:models.User,
                        as:'user'
                    }
                ]
            },
            {
                model:models.PropertyImage,
                as :'images'
            },
            {
                model: models.Unit,
                as:'units'
            },
        ]
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
//stats
exports.propertyStatistics = (req,res) =>{
    const {propertyId}=req.body
    try{
        models
            .Unit
            .findAll({where:{propertyId}})
            .then(units => {
                //
                let expectedRent=0;
                let collectedRent=0;
                let vacantUnits=0;
                let rentedUnits=0;
                for (let unit of units) {
                    expectedRent+=unit.rentAmount
                    if (unit.isRented) {
                        collectedRent+=unit.rentAmount
                        rentedUnits++
                    } else{
                        vacantUnits++
                    }
                }
                let result={
                    expectedRent,
                    collectedRent,
                    rentedUnits,
                    vacantUnits,
                }
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: 'A property statistics',
                        data:result
                    })
            }).catch(error => {
            return res
                .status(500)
                .json({
                    success: false,
                    message: 'A property statistics could not be retrieved',
                    error
                })
        })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: 'A property statistics could not be retrieved',
                error
            })
    }
}
/**
 * Admin stats
 * @param req
 * @param res
 * @returns {*}
 */
exports.adminPropertyStatistics = (req,res) =>{
    const {propertyId}=req.body
    try{
        models
            .Unit
            .findAll()
            .then(units => {
                //
                let expectedRent=0;
                let collectedRent=0;
                let vacantUnits=0;
                let rentedUnits=0;
                for (let unit of units) {
                    expectedRent+=unit.rentAmount
                    if (unit.isRented) {
                        collectedRent+=unit.rentAmount
                        rentedUnits++
                    } else{
                        vacantUnits++
                    }
                }
                let result={
                    expectedRent,
                    collectedRent,
                    rentedUnits,
                    vacantUnits,
                }
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: 'A property statistics',
                        data:result
                    })
            }).catch(error => {
            return res
                .status(500)
                .json({
                    success: false,
                    message: 'A property statistics could not be retrieved',
                    error
                })
        })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: 'A property statistics could not be retrieved',
                error
            })
    }
}
