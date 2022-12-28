const request = require('request');
const GENERIC_SERVER_ERROR_CODE = '01'

let handleError = (res, message, code) => {
    res.send({
        status: code || GENERIC_SERVER_ERROR_CODE,
        message: message
    });
}

let sendMpesaTxnToSafaricomAPI = (txnDetails, req, res, next) => {
    request({method: 'POST', url: txnDetails.url, headers: {'Authorization': txnDetails.authorization},json: txnDetails.transaction}, (error, response, body)=> {
        httpResponseBodyProcessor({
            body: body,
            error: error
        }, req, res, next)
    })
}

let sendCallbackMpesaTxnToAPIInitiator = function (txnDetails, req, res, next) {
    console.log('Requesting: ' + JSON.stringify(txnDetails))
    request(
        {
            method: 'POST',
            url: txnDetails.url,
            json: txnDetails.transaction
        },
        function (error, response, body) {
            httpResponseBodyProcessor({
                body: body,
                error: error
            }, req, res, next)
        }
    )
}


let httpResponseBodyProcessor = (responseData, req, res, next) => {
    console.log('HttpResponseBodyProcessor: ' + JSON.stringify(responseData))
    if(responseData.body){
        if(responseData.body.ResponseCode === '0'){
            console.log('POST Resp: ' + JSON.stringify(responseData.body))
            // Successful processing
            req.transactionResp = responseData.body
            next()
        }else{
            return handleError(res, ('Invalid remote response'), (responseData.body.errorCode || GENERIC_SERVER_ERROR_CODE))
        }
    }else{
        console.log('Error occurred: ' + JSON.stringify(responseData.body))
        return handleError(res, ('Invalid remote response'), (responseData.body.errorCode || GENERIC_SERVER_ERROR_CODE))
    }
}

let fetchLipaNaMpesaTransaction = function (keys, req, res, next) {
    console.log('Fetch initial transaction request...')
    // Check validity of message
    if (!req.body) {
        handleError(res, 'Invalid message received')
    }

    let query = LipaNaMpesa.findOne({
        'mpesaInitResponse.MerchantRequestID': keys.MerchantRequestID,
        'mpesaInitResponse.CheckoutRequestID': keys.CheckoutRequestID
    })

    // execute the query at a later time
    let promise = query.exec(function (err, lipaNaMPesaTransaction) {
        // handle error
        if (err) {
            handleError(res, 'Lipa Mpesa transaction not found')
        } else if (!lipaNaMPesaTransaction) {
            console.log('Lipa Mpesa transaction not found')
            next()
        } else {
            console.log('Transaction request found...')
            // Add transaction to req body
            req.lipaNaMPesaTransaction = lipaNaMPesaTransaction
            next()
        }
    })
}

let isEmpty = function (val) {
    return (!(val !== undefined && val != null && val.length > 0))
}

module.exports = {
    isEmpty: isEmpty,
    handleError: handleError,
    sendCallbackMpesaTxnToAPIInitiator: sendCallbackMpesaTxnToAPIInitiator,
    sendMpesaTxnToSafaricomAPI: sendMpesaTxnToSafaricomAPI,
    fetchLipaNaMpesaTransaction: fetchLipaNaMpesaTransaction
}
