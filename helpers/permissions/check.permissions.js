const models = require('../../models')
const AppResponseDto = require('../../dto/response/app.response.dto')

class CheckPermissions {
    constructor() {}
    checkPermission(roleId, permissionName){
        return new Promise((resolve, reject) => {
            models.Permission.findOne({
                where: {permission_name: permissionName}
            }).then((perm) => {
                models.RolePermission.findOne({
                    where: {
                        role_id: roleId,
                        permission_id: perm.id
                    }
                }).then((rolePermission) => {
                    if(rolePermission){
                        resolve(rolePermission)
                    }else{
                        reject({message: 'Forbidden'})
                    }
                }).catch(err => {
                    return reject(AppResponseDto.buildWithErrorMessages(err))
                })
            }).catch(err => {
                return reject(AppResponseDto.buildWithErrorMessages(err))
            })
        })
    }
}

module.exports = CheckPermissions
