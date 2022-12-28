const {logEvents} = require('../../middlewares/logEvents')

exports.buildSimpleSuccess = () => {
    return {success: true}
};

exports.buildSuccessWithMessages = (messages) => {
    let response = {success: true};

    if(typeof messages === 'string'){
        response.full_message = [messages];
    }
    else if (messages instanceof Array){
        response.full_message = messages
    }
    else if(messages instanceof Object){
        response.full_message = Object.values(messages);
    }

    return response;
}

exports.buildWithErrorMessages = (messages) => {
    let response = {success: false};
    response.errors = [];

    if(typeof messages === 'string'){
        response.full_message = [messages];
        logEvents(`${JSON.stringify(response.errors)}: ${response.full_message}`, 'errLog.txt').then(r => {});
    }
    else if (messages instanceof Array){
        response.full_message = messages
        logEvents(`${JSON.stringify(response.errors)}: ${response.full_message}`, 'errLog.txt').then(r => {});
    }
    else if(messages instanceof Error){
        response.full_message = [messages.name + '->' + messages.message];
        response.errors.push({name: messages.name, message: messages.message});
        response.errors.push({stack: messages.stack})
        logEvents(`${JSON.stringify(response.errors)}: ${response.full_message}`, 'errLog.txt').then(r => {});
    }
    else if(messages instanceof Object){
        response.errors = messages;
        response.full_message = Object.values(messages);
        logEvents(`${JSON.stringify(response.errors)}: ${response.full_message}`, 'errLog.txt').then(r => {});
    }
    return response;
}

function populateResponseWithMessage(response, success, messages) {
    if(response === null)
        response = {};
    response.success = !! success;
    if(typeof messages === 'string'){
        response.full_message = [messages];
    }
    else if (messages instanceof Array){
        response.full_message = messages
    }
    else if(messages instanceof Object){
        response.full_message = Object.values(messages);
    }

    return response;
}

exports.buildWithDtoAndMessages = (dto, messages) => {
    return populateResponseWithMessage(dto, true, messages);
}

exports.buildSuccessWithDto = (dto) => {
    return populateResponseWithMessage(dto, true, null);
}

exports.buildSimpleSuccess = () => {
    return {success: true};
}
