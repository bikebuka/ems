const sanitizeInput = require('../../utils/sanitize').sanitizeInput;
exports.createPropertyRequestDto = (body) => {
    const resultBinding = {
        validatedData: {},
        errors: {},
    };

    if(!body.property_name || body.property_name.trim() === null){
        resultBinding.errors.property_name = 'Property Name is required';
    }else{
        resultBinding.validatedData.property_name = sanitizeInput(body.property_name);
    }

    if(!body.property_description || body.property_description.trim() === null){
        resultBinding.errors.property_description = "Property Description is required";
    }else{
        resultBinding.validatedData.property_description = sanitizeInput(body.property_description)
    }

    if(!body.property_location || body.property_location.trim() === null){
        resultBinding.errors.property_location = "Property Location is required";
    }else{
        resultBinding.validatedData.property_location = sanitizeInput(body.property_location);
    }

    if(!body.property_code || body.property_code.trim() === null){
        resultBinding.errors.property_code = "Property code is required";
    }else{
        resultBinding.validatedData.property_code = sanitizeInput(body.property_code)
    }
    resultBinding.validatedData.created_by = null;
    resultBinding.validatedData.agency_id = null;

    return resultBinding;
}
