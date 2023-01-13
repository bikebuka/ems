//single unit
const models = require("../../models");
const Joi = require("joi");
const {formatCurrency} = require("../../utils/helpers/helpers");
const helpers = require("../../utils/helpers/helpers");
//
const TopUpSchema=Joi.object().keys({
    userId:Joi.number().required(),
    amount:Joi.number().required(),
    unitId:Joi.number().required()
})
//send to agent
const TransferSchema=Joi.object().keys({
    userId:Joi.number().required(),
    amount:Joi.number().required(),
    unitId:Joi.number().required(),
    agentId:Joi.number().required()
})
//user account
exports.myAccount = (req, res) => {
    models.Wallet.findOne({
        where: {id: req.params.id},
        include:[
            {
                model:models.User,
                as:'accountHolder',
            },
            {
                model:models.Unit,
                as:'unit',
                include: [
                    {
                        model: models.Property,
                        as:'property',
                        include:[
                            {
                                model:models.User,
                                as:'propertyOwner'
                            },
                            {
                                model:models.Agency,
                                as:'agency'
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
                            }
                        ]
                    }
                ]
            }
        ]
    }).then((unit) => {
        //
        if (unit===null) {
            return res.status(404)
                .json({
                    success: false,
                    message:"My Account Information",
                })
        }
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved an account details",
                data: unit
            })
    }).catch(error => {
        return res
            .status(500)
            .json({
                success: false,
                message: 'An account could not be retrieved',
                error
            })
    })
}
/**
 * Top Up Account
 * @param req
 * @param res
 */
exports.topUpMyAccount = async (req, res) => {
    const {body} = req;
    //
    const result = TopUpSchema.validate(body)
    const {value, error} = result;
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success: false,
                message: 'Invalid top up request',
                data: body
            })
    }
    //check if the agent is the one managing the unit
    try {
        const {userId, amount,unitId} = body
        //
        const [wallet,created]=await models
            .Wallet
            .findOrCreate({
                where: {
                    userId,
                },
                defaults: {
                    userId,
                    unitId,
                    accountBalance:amount
                }
            })
        if (created) {
            return res.status(201)
                .json({
                    success: false,
                    message: `Your first top up has been successfully processed. Your new account balance is KES ${amount}`,
                })
        } else{
            //update account balace
            wallet.update({accountBalance:wallet.accountBalance+amount})
            return res.status(201)
                .json({
                    success: false,
                    message: `Your top up has been successfully processed. Your new account balance is KES ${wallet.accountBalance}`,
                })
        }
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: 'You payment request could not be processed at this time.',
                error
            })
    }
}

/**
 * Send Money To Agent
 * @param req
 * @param res
 */
exports.sendToAgent = async (req, res) => {
    const {body} = req;
    //
    const result = TransferSchema.validate(body)
    const {value, error} = result;
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success: false,
                message: 'Invalid transfer request',
                data: body
            })
    }
    //check if the agent is the one managing the unit
    try {
        const {agentId, userId, amount,unitId} = req.body
        //update the sender account balance
        let sender = await models.Wallet
            .findOne({
                where: {userId}
            })
        //update their balance
        if (sender.accountBalance>=amount) {
            //agent
            const [wallet,created]=await models
                .Wallet
                .findOrCreate({
                    where: {userId:agentId},
                    defaults: {
                        userId:agentId,
                        unitId,
                        accountBalance:amount
                    }
                })
            if (created) {
                sender.update({
                    accountBalance: sender.accountBalance-amount,
                })
                return res.status(200)
                    .json({
                        success: true,
                        message: `You have successfully sent money to an agent, your new account balance is ${sender.accountBalance}`,
                    })
            }
            else{
                sender.update({
                    accountBalance: sender.accountBalance-amount,
                })
                wallet.update({
                    accountBalance: wallet.accountBalance+amount
                })
                return res.status(200)
                    .json({
                        success: true,
                        message: `You have successfully sent money to an agent, your new account balance is ${sender.accountBalance}`,
                    })
            }
        }else{
            return res.status(403)
                .json({
                    success: false,
                    message: `You have insufficient funds to transfer ${amount} to your agent! Top up to proceed and try again`,
                })
        }

    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: 'You payment request could not be processed at this time.',
                error
            })
    }
}
