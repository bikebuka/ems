function createPermissionDto(permission) {
    return {
        success: true,
        full_message: ['Permission created successfully']
    };
}

function buildNonPagedList(permissions, totalCountryCount){
    return {
        ...buildDto(permissions)
    }
}

function onlyName(permission) {
    return {name: permission.get('permission_name')}
}

function toNameList(permissions) {
    if(permissions == null) return [];
    return permissions.map(r => buildDto(r))
}

function buildDto(permission) {
    return {
        id: permission.id,
        name: permission.permission_name,
        description: permission.permission_description,
    }
}

function buildOriginalDetails(permission) {
    return {
        id: permission.id,
        name: permission.permission_name,
        description: permission.permission_description,
        slug: permission.permission_slug,
        is_active: permission.IsActive,
        is_deleted: permission.IsDeleted,
        created_by: permission.createdBy,
        created_at: permission.createdAt,
        updated_at: permission.updatedAt
    }
}

module.exports = {createPermissionDto, toNameList,buildDto, buildOriginalDetails, buildNonPagedList}
