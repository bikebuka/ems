const sanitizeInput = require('../../utils/sanitize').sanitizeInput;
exports.createAgentRequestDto = (body) => {
    const resultBinding = {
        validatedData: {},
        errors: {},
    };

    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!body.first_name || body.first_name.trim() === '')
        resultBinding.errors.first_name = 'First Name is required';
    else
        resultBinding.validatedData.first_name = sanitizeInput(body.first_name);

    if (!body.last_name || body.last_name.trim() === '')
        resultBinding.errors.last_name = 'Last Name is required';
    else
        resultBinding.validatedData.last_name = sanitizeInput(body.last_name);

    if (!body.phone_number || body.phone_number.trim() === '')
        resultBinding.errors.phone_number = 'Phone number is required';
    else
        resultBinding.validatedData.phone_number = sanitizeInput(body.phone_number);

    if (!body.username || body.username.trim() === '')
        resultBinding.errors.username = 'Username is required';
    else
        resultBinding.validatedData.username = sanitizeInput(body.username);

    if (body.email_address && body.email_address.trim() !== '' && emailRegex.test(String(body.email_address).toLowerCase()))
        resultBinding.validatedData.email_address = sanitizeInput(body.email_address.toLowerCase());
    else
        resultBinding.errors.email_address =  'Email is required';

    resultBinding.validatedData.is_active = true;
    resultBinding.validatedData.agency_id =null;
    resultBinding.validatedData.created_by = null;
    resultBinding.validatedData.is_active = true;

    return resultBinding;
};
