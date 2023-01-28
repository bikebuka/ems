const models =require('../../models');
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const bcrypt = require("bcrypt");
const {Op} = require("sequelize");
//User schema
const EmployeeSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName:Joi.string().required(),
    emailAddress:Joi.string().email().required(),
    employeeNumber:Joi.string(),
    salary:Joi.string().required()
});
//get all Employees
exports.index = (req,res) => {
    Promise.all([
        models.Employee.findAll({
            order:[
                'createdAt'
            ],
        }),
        models.Employee.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        console.log(results)
        const data = results.shift();
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved the list of Employees",
                data
            })
    }).catch(error=>{
        return res.status(500)
            .json({
                success: true,
                message:"Employees could not be retrieved",
                error
            })
    })
}
//single Employee
exports.show = (req, res) => {
    models.Employee.findOne({
        where: {id: req.params.id},
    }).then((Employee) => {
        //
        if (Employee===null) {
            return res.status(404)
                .json({
                    success: false,
                    message:"No Employee found with the provided ID",
                })
        }
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved a Employee",
                data: Employee
            })
    }).catch(error => {
        return res
            .status(500)
            .json({
                success: false,
                message: 'A Employee could not be created',
                error
            })
    })
}

//Create Employee account
exports.createAccount = (req,res) => {
    //request body
    const {body}=req;
    //
    const result=EmployeeSchema.validate(body)
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
        models.Employee.findOne({
            where: {
                [Op.or]: [{email:body.email},{employeeNumber:body.employeeNumber}]
            },
            attributes:['id','firstName','lastName','employeeNumber','email']
        }).then((Employee) => {
            if (Employee) {
                const errors = {};
                // If the Employee exists, return Error
                if (Employee.employeeNumber === body.employeeNumber)
                    errors.employeeNumber = 'Number: ' + body.employeeNumber + ' is already taken';

                if (Employee.email === body.email)
                    errors.emailAddress = 'Email: ' + body.email + ' is already taken';

                if (!_.isEmpty(errors)) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Sorry! Employee was not added.",
                            errors
                        })
                }
            }
            models
                .Employee
                .create(body)
                .then(Employee => {
                    //check if Employee has been created
                    if (!Employee) {
                        return res
                            .status(404)
                            .json({
                                success: false,
                                message: "Sorry! Employee was not added."
                            })
                    }
                    //
                    return res
                        .status(201)
                        .json({
                            success: true,
                            message: "An account has been created successfully.",
                            data: Employee
                        })
                })
            //
        })

    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message:"Employee was not added.",
                error
            })
    }
}
