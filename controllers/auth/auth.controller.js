const _ = require('lodash');
const crypto = require('crypto');
const models = require('../../models');
const sequelize = require('../../models/index').sequelize;
const Op = require('../../models/index').Sequelize.Op;

const jwt = require("jsonwebtoken");
const Joi = require('joi');
const bcrypt = require("bcrypt");
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
    userType:Joi.string(),
    password:Joi.string().required()
});
//login schema
const authSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
})
//Create user account
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

                if (user.emailAddress === body.emailAddress)
                    errors.emailAddress = 'Email: ' + body.email + ' is already taken';

                if (user.phoneNumber === body.phoneNumber)
                    errors.phoneNumber = 'Phone number: ' + body.phoneNumber + ' is already taken';

                if (!_.isEmpty(errors)) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Sorry! user was not added.",
                            errors
                        })
                }
            }
            //
            // Generate a salt
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;

                // Hash the password using the salt
                const {password}=body
                //
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    //
                    body.password=hash
                    //
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
                });
            });
            //
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
//login user
exports.login = (req,res) => {
    //request body
    const {body}=req;
    //
    const result=authSchema.validate(body)
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
    //authenticate
    // Validate the username and password
    const {username,password}=body
    models.User
        .findOne({
            where: {
                [Op.or]: [{username:body.username},{emailAddress:username}, {phoneNumber:username}]
            },
            attributes:['id','firstName','middleName','lastName','userType','status','createdAt','approvedBy',
                'updatedAt','username','emailAddress','phoneNumber','password']
        })
        .then((user) => {
            if (!user) {
                return res.status(400)
                    .json({
                        success:false,
                        message: 'Username or password is incorrect'
                    });
            }
            //
            bcrypt.compare(password, user.password)
                .then(async (isMatch) => {
                    if (!isMatch) {
                        return res.status(400)
                            .json({
                                success: false,
                                message: 'Username or password is incorrect'
                            });
                    }
                    //
                    const unit = await models.Unit.findOne(
                        {
                            where: {tenantId: user.id},
                            include:[
                                {
                                    model:models.Property,
                                    as:'property',
                                    include:[
                                        {
                                            model:models.Agent,
                                            as: 'agent',
                                            include: [
                                                {
                                                    model:models.User,
                                                    as:'user'
                                                }
                                            ]
                                        },
                                        {
                                            model:models.Agency,
                                            as: 'agency'
                                        }
                                    ]
                                },
                            ]
                        }
                    );
                    console.log(unit)
                    // If the username and password are valid, generate a JWT token
                    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
                        expiresIn: '10d'
                    });
                    const {password, ...userWithoutPassword} = user;
                    delete userWithoutPassword.dataValues.password
                    //set user response
                    const data = {
                        user: userWithoutPassword.dataValues,
                        unit
                    }
                    // Send the token back to the client
                    res.json({
                        success: true,
                        message: 'You have successfully logged in.',
                        data,
                        token
                    });
                });
        });
}
