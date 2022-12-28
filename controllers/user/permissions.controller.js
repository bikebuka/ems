const models = require('../../models');
const _ = require("lodash");
const Op = require('../../models/index').Sequelize.Op;
const PermissionRequestDto = require('../../dto/request/permission.request.dto');
const PermissionResponseDto = require('../../dto/response/permission.response.dto')
const AppResponseDto = require('../../dto/response/app.response.dto');
const CheckPermission = require('../../helpers/permissions/check.permissions');
const CountryResponseDto = require("../../dto/response/country.response.dto");
const helper = new CheckPermission();

exports.createPermission = (req, res) => {
    helper.checkPermission(req.user.Roles[0].id,'PERMISSION_CREATE').then((rolePerm) => {
        const body = req.body;
        const resultBinding = PermissionRequestDto.createPermissionRequestDto(req.body);
        if(!_.isEmpty(resultBinding.errors)){
            return res.status(422).json(AppResponseDto.buildWithErrorMessages(resultBinding.errors));
        }
        resultBinding.validatedData.createdBy = req.user.id;
        const permission_name = resultBinding.validatedData.permission_name;
        models.Permission.findOne({
            where: {
                [Op.or]: [{permission_name}]
            }
        }).then((permission) => {
            if(permission) {
                const errors = {};
                if (permission.permission_name === body.permission_name)
                    errors.permission_name = 'Permission: ' + body.permission_name + ' already exists';

                if (!_.isEmpty(errors)) {
                    return res.status(403).json(AppResponseDto.buildWithErrorMessages(errors));
                }
            }
            models.Permission.create(resultBinding.validatedData).then((perm) => {
                if(perm === null){
                    throw perm;
                }
                if(perm){
                    res.json(PermissionResponseDto.createPermissionDto());
                }
                else{
                    console.log('permission is empty')
                }
            }).catch(err => {
                return res.status(400).send(AppResponseDto.buildWithErrorMessages(err))
            })
        }).catch(err => {
            return res.status(400).send(AppResponseDto.buildWithErrorMessages(err))
        })
    }).catch((err) => {
      return res.status(403).json(AppResponseDto.buildWithErrorMessages('You do not have permissions::PERMISSION_CREATE'))
    })
}

exports.updatePermission = (req, res) => {
    helper.checkPermission(req.user.Roles[0].id,'PERMISSION_UPDATE').then((rolePerm) => {
        const body = req.body;
        const resultBinding = PermissionRequestDto.createPermissionRequestDto(req.body);
        if(!_.isEmpty(resultBinding.errors)){
            return res.status(422).json(AppResponseDto.buildWithErrorMessages(resultBinding.errors));
        }
        resultBinding.validatedData.createdBy = req.user.id;
        const permission_name = resultBinding.validatedData.permission_name;


    }).catch((err) => {
        return res.status(403).json(AppResponseDto.buildWithErrorMessages('You do not have permissions::PERMISSION_CREATE'))
    })
}

exports.getPermissionByIdOrSlug = (req, res) =>{
    helper.checkPermission(req.user.Roles[0].id, 'PERMISSION_VIEW').then(() => {
        const query = _.assign(req.query)
        console.log(query)
        models.Permission.findOne({query, include:[{model: models.Users}]}).then(permission => {
            return res.status(200).json(PermissionResponseDto.buildOriginalDetails(permission))
        }).catch(err => {
            return res.status(500).json(AppResponseDto.buildWithErrorMessages(err))
        })
    }).catch((err) => {
        return res.status(403).json(AppResponseDto.buildWithErrorMessages('You do not have permissions::PERMISSION_VIEW'))
    })
}

exports.assignPermissionToRole = async (req, res, next) => {
    const roleName = req.body.role_name;
    const permissionName = req.body.permission_name;

    if(!roleName && !permissionName){
        res.status(400).send({error:'You need a role name and permission name'});
        return;
    }
    if(roleName === null){
        res.status(400).send({error:'Role name is required'});
        return;
    }
    if(permissionName === null){
        res.status(400).send({error:'Permission name is required'});
        return;
    }

    const permission = await models.Permission.findOne({where: {permission_name:permissionName}});
    if(permission === null){
        // permission not found
        return res.status(404).json(AppResponseDto.buildWithErrorMessages('Permission not found'))
    }else{
        // permission found
        const role = await models.Roles.findOne({where: {name: roleName}});
        if(role === null){
            // role not found
            return res.status(404).json(AppResponseDto.buildWithErrorMessages('Role not found'))
        }else{
            // role found
            let role_id = role.id;
            let permission_id = permission.id;

            const roleAssigned = await models.RolePermission.findOne({where: {[Op.and]:[{role_id},{permission_id}]}});
            if(roleAssigned !== null){
                // role already assigned to permission
                return res.json(AppResponseDto.buildWithErrorMessages('Role aleady attached to permission'))
            }else{
                await models.RolePermission.create({role_id,permission_id}).then(() => {
                    return res.json(AppResponseDto.buildSuccessWithMessages('Role attached to permission successfully'))
                }).catch(err => {
                    return res.json(AppResponseDto.buildWithErrorMessages(err))
                })
            }
        }
    }
}

exports.getAllPermissionsNoPage = (req,res, next) => {
    Promise.all([
        models.Permission.findAll({
            order:[
                'permission_name','createdAt'
            ],
            attributes: ['id','permission_name','permission_slug','permission_description','IsActive','IsDeleted', 'createdAt', 'createdBy'],
        }),
        models.Permission.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        const countries = results[0];
        const countriesCount = results[1].count;
        return res.json(PermissionResponseDto.buildNonPagedList(countries, countriesCount))
    }).catch(err=>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}
