const RolesDto = require('./role.response.dto');
const PermissionDto = require('./permission.response.dto')
const RefreshTokenDto = require('./refresh.token.response.dto')

function registerDto(user) {
    return {
        success: true,
        full_message: ['User registered successfully']
    };
}

function loginSuccess(user) {
    const token = user.generateJwt();
    return {
        success: true,
        token,
        user: {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email_address: user.email_address,
            roles: RolesDto.toNameList(user.Roles || []),
            permissions: PermissionDto.toNameList(user.Roles[0].Permissions || []),
            token,
            refresh_token: user.RefreshToken?.token || [],
        }
    }
}

function buildBasicDtos(users) {
    if (!users)
        return {user: []};
    return {
        user: users.map(user => buildBasicInfo(user))
    }
}

function buildBasicInfo(user) {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        phone_number: user.phone_number,
        username: user.username,
        description: user.description,
    }
}

function buildDtos(users) {
    if (!users)
        return {user: []};
    return {
        users: users.map(user => buildBasicInfo(user, true))
    }
}

module.exports = {
    registerDto, loginSuccess,buildBasicInfo, buildDtos, buildBasicDtos
}
