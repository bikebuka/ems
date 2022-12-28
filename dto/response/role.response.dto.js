const PageMetaDto = require('./page_meta.dto')
const UserResponseDto = require('./user.response.dto')
const PermissionDto = require('./permission.response.dto')
function onlyName(role) {
    return {name: role.get('name')}
}

function toNameList(roles) {
    if(roles == null) return [];
    return roles.map(r => buildDto(r))
}

function buildDto(role) {
    return {
        id: role.id,
        name: role.name,
        slug: role.slug,
        description: role.description,
        is_active: role.IsActive,
        is_deleted: role.IsDeleted,
        created_by: role.createdBy,
        date_created: role.createdAt
    }
}

function buildNonPagedList(roles, totalRoleCount){
    return {
        ...buildDto(roles)
    }
}

function buildDtos(roles) {
    if(!roles){
        return {roles: []}
    }
    return {
        roles: roles.map(role => buildDto(role))
    }
}

function buildPagedList(roles, page, pageSize, totalItemCount, basePath) {
    return {
        success: true,
        page_meta: PageMetaDto.build(roles.length, page, pageSize, totalItemCount, basePath),
        ...buildDtos(roles)
    }
}

function buildDetails(role) {
    return {
        id: role.id,
        name: role.name,
        slug: role.slug,
        description: role.description,
        is_active: role.IsActive,
        is_deleted: role.IsDeleted,
        date_created: role.createdAt,
        created_by: role.Users,
        permissions: PermissionDto.buildDto(role.Permissions) || {}
    }
}

module.exports = {
    onlyName, toNameList, buildPagedList, buildDto, buildDetails, buildNonPagedList
}
