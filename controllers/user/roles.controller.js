const sequelize = require('../../models/index').sequelize;
const models = require('../../models');
const Op = require('../../models/index').Sequelize.Op;
const AppResponseDto = require('../../dto/response/app.response.dto');
const RoleDto = require('../../dto/response/role.response.dto');
const _ = require("lodash");

exports.getRoles = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 5;
    const offset = (page -1) * pageSize;

    models.Roles.findAndCountAll({
        offset,
        limit: pageSize
    }).then((roles) => {
        return res.status(200).json(RoleDto.buildPagedList(roles.rows,page,pageSize,roles.count, req.baseUrl));
    }).catch(err => {
        return res.status(500).json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.createRole = async (req, res) => {
    const roleObj = {};
    if(req.body.name){
        roleObj.name = req.body.name;
    }
    if(req.body.description){
        roleObj.description = req.body.description;
    }
    if(roleObj.name === null){
        return res.json(AppResponseDto.buildWithErrorMessages('You must provide role name'));
    }
    console.log(req.user.id)
    roleObj.createdBy = req.user.id;
    roleObj.IsActive = req.body.is_active;

    const foundRole = await models.Roles.findOne({where: {name: roleObj.name}})
    if(!foundRole){
        await models.Roles.create(roleObj).then(role => {
            return res.json(AppResponseDto.buildWithDtoAndMessages(RoleDto.buildDto(role), 'Role created successfully'))
        })
    }else{
        return res.json(AppResponseDto.buildWithErrorMessages('Role already exists'))
    }
}

exports.updateRole = (req, res) => {

}

exports.deleteRole = (req, res) => {

}

exports.getRoleByIdOrSlug = (req, res) => {
    const query = _.assign(req.query, {
        include: [
            {
                model: models.Permission,
                include: [{model: models.Users}]
            },
            {
                model: models.Users,
            }
        ]
    })

    models.Roles.findOne(query).then(async role => {
        return await res.json(RoleDto.buildDetails(role))
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.assignRoleToUser = async (req, res) => {
    const roleName = req.body.role_name;
    const userId = req.body.user_id;

    if(!roleName || !userId){
        res.status(400).send({error:'You need a role name and user id'});
        return;
    }
    // check if role exists
    const role = await models.Roles.findOne({where:{name: roleName}});
    console.log(role)
    if(role !== null){
        // role found
        const user = await models.Users.findOne({where: {id:userId}});
        if(user !== null){
            // user found
            let user_id = user.id;
            let role_id = role.id;

            const userRole = await models.UserRoles.findOne({where:{[Op.and]: [{role_id, user_id}]}});
            if(userRole !== null){
                // user already assigned to the role
                return res.json(AppResponseDto.buildWithErrorMessages('User already attached to this role'))
            }else{
                // user not assigned to role
                const currentUserRole = await models.UserRoles.findOne({where: {user_id}});
                if(currentUserRole !== null){
                    // user has a role
                    if(currentUserRole.role_id === role_id){
                        return res.json(AppResponseDto.buildWithErrorMessages('User already attached to this role'))
                    }else{
                        await models.UserRoles.update(
                            {role_id: role_id},
                            {where: {user_id}}
                        ).then(updated => {
                            return res.json(AppResponseDto.buildSuccessWithMessages('User role updated successfully'))
                        })
                    }
                }else{
                    // user has no role
                    await models.UserRoles.create({
                        role_id,user_id
                    }).then(() => {
                        return res.json(AppResponseDto.buildSuccessWithMessages('User attached to role successfully'))
                    }).catch(err => {
                        return res.json(AppResponseDto.buildWithErrorMessages(err))
                    })
                }
            }
        }else{
            //user not found
            return res.status(404).json(AppResponseDto.buildWithErrorMessages('User not found'))
        }
    }else{
        // role not found
        return res.status(404).json(AppResponseDto.buildWithErrorMessages('Role not found'))
    }
}

exports.getAllRolesNoPage = (req,res, next) => {
    Promise.all([
        models.Roles.findAll({
            order:[
                'name','createdAt'
            ],
            attributes: ['id','name','slug','description','IsActive','IsDeleted', 'createdAt', 'createdBy'],
        }),
        models.Roles.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        const roles = results[0];
        const rolesCount = results[1].count;
        return res.json(RoleDto.buildNonPagedList(roles, rolesCount))
    }).catch(err=>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}
