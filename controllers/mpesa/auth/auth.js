const moment = require('moment');
const request = require('request');
let unirest = require('unirest');
const axios = require('axios')
const http = require('node:http');
const STK_PUSH = 'STK-PUSH';
let C2B_URL_REGISTRATION_SERVICE_NAME = 'C2B-URL-REGISTRATION'
let TOKEN_INVALIDITY_WINDOW = 240
let GENERIC_SERVER_ERROR_CODE = '01'

const models = require('../../../models')
const AppResponseDto = require('../../../dto/response/app.response.dto');
const properties = require('../../../config/mpesa.properties')
const mpesaFunctions = require('../../../helpers/mpesa/mpesa.helper')

let fetchToken = (req, res, next) => {
    console.log('Fetching token')
    let serviceName = req.body.service;
    models.Token.findOne({
        where: {service: serviceName}
    }).then(records => {
        console.log(records)
        if(records!== null  && isTokenValid(records)){
            console.log('Current token is still valid'+serviceName)
            req.transactionToken = records.access_token
        }else{
            console.log('Current token is invalid'+serviceName)
            setNewToken(req, res, serviceName, true, next)
        }
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

let isTokenValid = (service) => {
    let tokenAge = moment.duration(moment(new Date()).diff(service.last_updated)).asSeconds() + TOKEN_INVALIDITY_WINDOW
    return (tokenAge < service.timeout)
}

let setNewToken = async (req, res, serviceName, newInstance, next) => {
    let consumerKey = '';
    let consumerSecret = '';
    let token = {}
    let url = properties.auth.url

    switch (serviceName) {
        case STK_PUSH: {
            consumerKey = 'uKslKeiaBAKNvDWyQTXOh2a7Mr6dzO5j'
            consumerSecret = 'D4S3GFGWnbVmZjVd'
            break
        }

        case C2B_URL_REGISTRATION_SERVICE_NAME: {
            consumerKey = properties.validationConfirm.consumerKey
            consumerSecret = properties.validationConfirm.consumerSecret
            break
        }
    }

    let consumer_key = properties.lipaNaMpesa.consumerKey;
    let consumer_secret = properties.lipaNaMpesa.consumerSecret;


    //form a buffer of the consumer key and secret
    let buffer = new Buffer.from(consumer_key+":"+consumer_secret);

    let auth = `Basic ${buffer.toString('base64')}`;

    try{

        let {data} = await axios.get(url,{
            "headers":{
                "Authorization":auth
            }
        });

        req.token = data['access_token'];

        return next();

    }catch(err){

        return res.send({
            success:false,
            message:err['response']['statusText']
        });
    }
    // let options = {
    //     'method': 'GET',
    //     'url': url,
    //     'headers': {
    //         'Authorization' : auth
    //     }
    // }
    // request(options, function (error, response) {
    //     if (error) throw new Error(error);
    //     console.log(response.body);
    // })
    //let headers = new Headers();
    // var options = {
    //     hostname: url,
    //     port: 80,
    //     method: 'GET',
    //     headers: {
    //         'Accept': 'application/json',
    //         "Authorization": "Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==",
    //         'Content-Type': 'application/json',
    //         'Origin': '',
    //         'Host': 'api.producthunt.com'
    //     }
    // }
    //
    // const headers = {
    //     'Authorization': auth,
    // }
    // console.log(headers)
    // request(url, headers, function (error, response, body) {
    //     console.log(response)
    // })
    // request( url, {headers: {'Authorization': auth}}, function (error, response, body) {
    //     console.log(body)
    //     let tokenResp = body
    //
    //     if(!error || tokenResp.errorCode) {
    //         let newToken = {
    //             last_updated: moment().format('YYYY-MM-DD HH:mm:ss'),
    //             access_token: tokenResp.access_token,
    //             timeout: tokenResp.expires_in,
    //             service: serviceName
    //         }
    //
    //         if(newInstance){
    //             models.Token.create(newToken).then(result => {
    //                 return res.json(AppResponseDto.buildSuccessWithMessages('Token created'))
    //             }).catch(err => {
    //                 return res.json(AppResponseDto.buildWithErrorMessages(err))
    //             })
    //         }else{
    //             let conditions = {service: serviceName}
    //             let options = {multi: true}
    //
    //             models.Token.update({newToken}, {where: {service: serviceName}}).then(result => {
    //                 return res.json(AppResponseDto.buildSuccessWithMessages('Token updated'))
    //             }).catch(err => {
    //                 return res.json(AppResponseDto.buildWithErrorMessages(err))
    //             })
    //         }
    //     }else{
    //         mpesaFunctions.handleError(res, 'Error processing Token', GENERIC_SERVER_ERROR_CODE)
    //     }
    // })
}

module.exports = {
    fetchToken: fetchToken
}
