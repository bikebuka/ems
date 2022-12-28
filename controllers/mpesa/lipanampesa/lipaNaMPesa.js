const moment = require('moment');
const auth = require('../auth/auth');
const mpesaFunctions = require('../../../helpers/mpesa/mpesa.helper');
const properties = require('../../../config/mpesa.properties');

const LIPA_NA_MPESA_SERVICE_NAME = 'STK-PUSH'
const GENERIC_SERVER_ERROR_CODE = '01'

const bootstrapRequest = (req, res, next) => {
    req.body.service = LIPA_NA_MPESA_SERVICE_NAME
    const request = req.body

    console.log('===========',request.phoneNumber)
    if (!(request.amount || request.phoneNumber || request.callBackURL || request.accountReference || request.description)) {
        mpesaFunctions.handleError(res, 'Invalid request received')
    } else {
        let BusinessShortCode = properties.lipaNaMpesa.shortCode;
        let timestamp = moment().format('YYYYMMDDHHmmss')
        let rawPass = BusinessShortCode + properties.lipaNaMpesa.key + timestamp

        req.mpesaTransaction = {
            BusinessShortCode: BusinessShortCode,
            Password: Buffer.from(rawPass).toString('base64'),
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: request.amount,
            PartyA: request.phoneNumber,
            PartyB: BusinessShortCode,
            PhoneNumber: request.phoneNumber,
            CallBackURL: properties.lipaNaMpesa.callBackURL,
            AccountReference: request.accountReference,
            TransactionDesc: request.description
        }
        console.log(' POST Req: ' + JSON.stringify(req.mpesaTransaction))
        next()
    }
}

let postTransaction = (req, res, next) => {
    mpesaFunctions.sendMpesaTxnToSafaricomAPI({
        url: properties.lipaNaMpesa.processRequest,
        auth: 'Bearer ' + req.transactionToken,
        transaction: req.mpesaTransaction
    }, req, res, next)
}

let processResponse = (req, res, next) => {
    console.log('Process response')
    req.merchantMsg = {
        status: req.transactionResp.ResponseCode === '0' ? '00' : req.transactionResp.ResponseCode,
        message: req.transactionResp.ResponseDescription,
        merchantRequestId: req.transactionResp.MerchantRequestID,
        checkoutRequestId: req.transactionResp.CheckoutRequestID
    }
}


module.exports = {
    postTransaction: postTransaction
}
