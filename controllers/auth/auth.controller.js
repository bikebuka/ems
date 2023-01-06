const _ = require('lodash');
const crypto = require('crypto');
const models = require('../../models');
const sequelize = require('../../models/index').sequelize;
const Op = require('../../models/index').Sequelize.Op;

const jwt = require("jsonwebtoken");
const Joi = require('joi');
//User schema
const userSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    middleName:Joi.string(),
    lastName:Joi.string().required(),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    emailAddress:Joi.string()
        .email()
        .required(),
    phoneNumber:Joi.string().required(),
    password:Joi.string().required()
});
//
exports.createAccount = (req,res) => {
    //request body
    const {body}=req;
    //
    const result=userSchema.validate(body)
    const { value, error } = result;
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success:false,
                message: 'Invalid request',
                data: body
            })
    }
    // save
    try {
        //hash password
        body.password=crypto.randomBytes(48).toString('hex');
        //
        models.User.findOne({
            where: {
                [Op.or]: [{username:body.username},{emailAddress:body.emailAddress}, {phoneNumber:body.phoneNumber}]
            },
            attributes:['id','username','emailAddress','phoneNumber']
        }).then((user) => {
            if (user) {
                const errors = {};
                // If the user exists, return Error
                if (user.username === body.username)
                    errors.username = 'username: ' + body.username + ' is already taken';

                if (user.email_address === body.email_address)
                    errors.email_address = 'Email: ' + body.email + ' is already taken';

                if (user.phone_number === body.phone_number)
                    errors.phone_number = 'Phone number: ' + body.phone_number + ' is already taken';

                if (!_.isEmpty(errors)) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Sorry! user was not added.",
                            errors
                        })
                }
                models
                    .User
                    .create(body)
                    .then(user => {
                        //check if user has been created
                        if (!user) {
                            return res
                                .status(404)
                                .json({
                                    success: false,
                                    message: "Sorry! user was not added."
                                })
                        }
                        //
                        return res
                            .status(201)
                            .json({
                                success: true,
                                message: "An account has been created successfully.",
                                data: user
                            })
                    })
            }
        })

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message:"User was not added.",
                error
            })
    }


}
