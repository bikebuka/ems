//single unit
const models = require("../../models");
const Joi = require("joi");
//
const TransactionUpSchema=Joi.object().keys({
    payerID:Joi.number().required(),
    amount:Joi.number().required(),
    transactionId:Joi.string().required(),
    unitId:Joi.number().required(),
    accountReference:Joi.string().required(),
    accountNumber:Joi.string().required(),
})

exports.initiateRentTransaction = async (req,res) =>{
    const {body} = req;
    //
    const result = TransactionUpSchema.validate(body)
    const {value, error} = result;
    //
    const valid = error == null;
    if (!valid) {
        return res.status(400)
            .json({
                success: false,
                message: 'Invalid transaction request',
                data: error
            })
    } else {
        try {
            const {transactionId, amount,unitId,payerID,accountReference,accountNumber} = body
            //
            const [transaction,created]=await models
                .Transaction
                .findOrCreate({
                    where: {
                        transactionId,
                    },
                    defaults: {
                        accountReference,
                        unitId,
                        accountNumber,
                        amount,
                        payerID,
                        transactionId
                    }
                })
            if (created) {
                return res.status(201)
                    .json({
                        success: true,
                        message: `Your rent payment has been initiated. Please proceed to confirm payment`,
                        data:created
                    })
            } else{
                //update transaction
                transaction.update({amount,accountReference,accountNumber,payerID,unitId})
                //
                return res.status(201)
                    .json({
                        success: true,
                        message: `Your rent payment transaction has been initiated`,
                        data:transaction
                    })
            }
        } catch (error) {
            return res.status(500)
                .json({
                    success: false,
                    message: 'Your rent payment request could not be processed at this time.',
                    error
                })
        }
    }
}
