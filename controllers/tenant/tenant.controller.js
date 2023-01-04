const models =require('../../models');
const AppResponseDto =  require('../../dto/response/app.response.dto');
const CountryResponseDto = require("../../dto/response/country.response.dto");
const CompanyResponseDto = require("../../dto/response/company.response.dto")
const UserRequestDto = require("../../dto/request/user.request.dto");
const UserResponseDto = require('../../dto/response/user.response.dto')
const CompanyRequestDto = require("../../dto/request/company.request.dto");
const _ = require("lodash");
const {sequelize} = require("../../models");
const AdminRegisterUserMailer = require("../../helpers/mailers/register.user.helper");
const PropertyResponseDto = require("../../dto/response/property.response.dto");
const AgentRequestDto = require("../../dto/request/agent.request.dto");
const {forEach} = require("lodash");
const Op = require('../../models/index').Sequelize.Op;
const UnitResponseDto = require('../../dto/response/unit.reponse.dto')
//
exports.getTenants = async (req,res) =>{
    models.Tenant.findAll().then(results => {
        return res
            .status(200)
            .json({
                success: true,
                message: 'you have successfully retrieved tenants',
                data: results
            })
    }).catch(err=> {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}
//
exports.register = async (req, res) => {
    const body= req.body;
    let currentUser = req.user.id;

    const bindingResult = UserRequestDto.createUserRequestDto(req.body);
    const agentBindingResult = AgentRequestDto.createAgentRequestDto(req.body);

    const promises = [];
    if(!_.isEmpty(bindingResult.errors)){
        return res.json(AppResponseDto.buildWithErrorMessages(bindingResult.errors))
    }
    if(!_.isEmpty(agentBindingResult.errors)){
        return res.json(AppResponseDto.buildWithErrorMessages(agentBindingResult.errors))
    }

    agentBindingResult.validatedData.created_by = currentUser;
    agentBindingResult.validatedData.agency_id = req.body.agency_id;

    const email_address =  bindingResult.validatedData.email_address;
    const phone_number = bindingResult.validatedData.phone_number;
    const username = bindingResult.validatedData.username;

    models.Users.findOne({
        where: {
            [Op.or]: [{username},{email_address}, {phone_number}]
        }
    }).then((user) => {
        if (user) {
            const errors = {};
            // If the user exists, return Error
            if (user.username === body.username)
                errors.username = 'username: ' + body.username + ' is already taken';

            if (user.email_address === body.email_address)
                errors.email_address = 'Email: ' + body.email_address + ' is already taken';

            if (user.phone_number === body.phone_number)
                errors.phone_number = 'Phone number: ' + body.phone_number + ' is already taken';

            if (!_.isEmpty(errors)) {
                return res.status(403).json(AppResponseDto.buildWithErrorMessages(errors));
            }
        }

        let transac = undefined;
        sequelize.transaction({autocommit: false}).then(async function (transaction){
            transac = transaction;
            const role = "TENANT";
            const roleDescription = "This role belongs tenants in general."

            promises.push(models.Roles.findOrCreate({
                where: {name: role},
                defaults: {description: roleDescription}
            }));
            bindingResult.validatedData.IsApproved = true;
            promises.push(models.Users.create(bindingResult.validatedData, {transaction}));
            promises.push(models.Tenant.create(agentBindingResult.validatedData, {transaction}));
            await Promise.all(promises).then(async results => {
                console.log(results)
                promises.length = 0;
                const owner = results.pop();
                const user = results.pop();
                const role = [];

                results.forEach(result => {
                    if(result[0].constructor.getTableName() === 'Roles')
                        role.push(result[0])

                })
                promises.push(user.setRoles(role, {transaction}))
                promises.push(owner.setUsers(user, {transaction}))

                for (let i = 0; req.files != null && i < req.files.length; i++) {
                    let file = req.files[i];
                    console.log(file)
                    let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
                    filePath = filePath.replace('public', '');
                    promises.push(models.ProfilePicture.create({
                        file_name: file.filename,
                        file_path: filePath,
                        original_name: file.originalname,
                        file_size: file.size,
                        user_id: user.id
                    }, {transaction: transaction}));
                }

                await Promise.all(promises).then(results => {
                    user.images = _.takeRightWhile(results, result => {
                        return result.constructor.getTableName && result.constructor.getTableName() === 'ProfilePictures'
                    });
                    user.roles = role;
                    owner.users = user;
                    transaction.commit();
                    AdminRegisterUserMailer.send(user.email_address, `${user.last_name}`, user.username, bindingResult.validatedData.password);
                    return res.json(AppResponseDto.buildWithDtoAndMessages(UserResponseDto.buildBasicInfo(user) , 'Tenant registered successfully'))
                }).catch(err => {
                    return res.json(AppResponseDto.buildWithErrorMessages(err))
                })
            }).catch(err => {
                return res.json(AppResponseDto.buildWithErrorMessages(err))
            })
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages(err))
        })
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getMyUnits = async (req, res) => {
    const currentUser = req.user.id;

    const unitIds = []
    const unit = await models.TenantUnit.findAll({
        where: {
            [Op.and]: [{tenant_id: currentUser},{current_owner: true}]
        }
    })
    for(let i = 0;i<unit.length;i++){
        unitIds.push(unit[i].unit_id)
    }

    if(unitIds.length < 1){
        return res.json(AppResponseDto.buildWithErrorMessages('No units'))
    }else{
        console.log(unitIds)
        models.Unit.findAll({
            where: {
                id: unitIds
            },
            include:[
                {model: models.Property}
            ]
        }).then(results => {
            console.log(results)
            return res.json(UnitResponseDto.buildDtos(results))
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages(err))
        })
    }
}

exports.payRent = (req, res) => {
    const tenant_id = req.user.id;
    const unit_id = req.body.unit_id;
    const amount = req.body.amount;

    if(!tenant_id || !unit_id || !amount){
        res.status(400).send({error:'You need a tenant and unit and amount'});
        return;
    }else{
        models.RentHistory.create({
            tenant_id: tenant_id,
            unit_id: unit_id,
            amount_paid: amount,
            createdAt: new Date(),
            updatedAt: new Date()
        }).then(result => {
            return res.json(AppResponseDto.buildSuccessWithMessages('Rent Paid successfully'))
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages(err))
        })
    }
}
