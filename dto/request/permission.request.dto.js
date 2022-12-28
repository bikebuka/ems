const sanitizeInput = require('../../utils/sanitize').sanitizeInput;
exports.createPermissionRequestDto = (body) => {
    const resultBinding = {
        validatedData: {},
        errors: {},
    };


    if (!body.permission_name || body.permission_name.trim() === '')
        resultBinding.errors.permission_name = 'Permission Name is required';
    else
        resultBinding.validatedData.permission_name = sanitizeInput(body.permission_name);

    if (!body.permission_description || body.permission_description.trim() === '')
        resultBinding.errors.permission_description = 'Permission description is required';
    else
        resultBinding.validatedData.permission_description = sanitizeInput(body.permission_description);

    resultBinding.validatedData.IsActive = false;
    resultBinding.validatedData.IsDeleted = false;
    resultBinding.validatedData.createdBy = null;

    return resultBinding;
};
