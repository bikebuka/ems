const sanitizeInput = require('../../utils/sanitize').sanitizeInput;
exports.createCompanyRequestDto = (body) => {
    const resultBinding = {
        validatedData: {},
        errors: {},
    };

    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!body.company_name || body.company_name.trim() === '')
        resultBinding.errors.company_name = 'Company Name is required';
    else
        resultBinding.validatedData.company_name = sanitizeInput(body.company_name);

    if (!body.office_phone || body.office_phone.trim() === '')
        resultBinding.errors.office_phone = 'Office is required';
    else
        resultBinding.validatedData.office_phone = sanitizeInput(body.office_phone);

    // if (!body.company_description || body.company_description.trim() === '')
    //     resultBinding.errors.company_description = 'Company description is required';
    // else
    //     resultBinding.validatedData.company_description = sanitizeInput(body.company_description);

    if (body.office_email && body.office_email.trim() !== '' && emailRegex.test(String(body.office_email).toLowerCase()))
        resultBinding.validatedData.office_email = sanitizeInput(body.office_email.toLowerCase());
    else
        resultBinding.errors.office_email =  'Office Email is required';


    resultBinding.validatedData.company_description = null;
    resultBinding.validatedData.address_1 = sanitizeInput(body.address_1);
    resultBinding.validatedData.address_2 = sanitizeInput(body.address_2);
    resultBinding.validatedData.office_cell = sanitizeInput(body.office_cell);
    resultBinding.validatedData.office_name = sanitizeInput(body.office_name);
    resultBinding.validatedData.building_name = sanitizeInput(body.building_name);
    resultBinding.validatedData.road_street = sanitizeInput(body.road_street);
    resultBinding.validatedData.office_floor = sanitizeInput(body.office_floor);
    resultBinding.validatedData.website = sanitizeInput(body.website);
    resultBinding.validatedData.is_agency = body.is_agency;
    resultBinding.validatedData.is_active = body.is_active;

    return resultBinding;
};
