const _ = require('lodash');
const models = require('../../models');
const sequelize = require('../../models/index').sequelize;
const AppResponseDto = require('../../dto/response/app.response.dto');
const UserRequestDto = require('../../dto/request/user.request.dto');
const UserResponseDto = require('../../dto/response/user.response.dto');
const AgentRequestDto = require('../../dto/request/agent.request.dto');
const AdminRegisterUserMailer = require("../../helpers/mailers/register.user.helper");
const CompanyResponseDto = require("../../dto/response/company.response.dto");
const AgentResponseDto = require('../../dto/response/agent.response.dto')
const PropertyResponseDto = require("../../dto/response/property.response.dto");
const Op = require('../../models/index').Sequelize.Op;

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
            const role = "ADMIN_AGENT";
            const roleDescription = "This role belongs agents in general."

            promises.push(models.Roles.findOrCreate({
                where: {name: role},
                defaults: {description: roleDescription}
            }));
            bindingResult.validatedData.IsApproved = true;
            promises.push(models.Users.create(bindingResult.validatedData, {transaction}));
            promises.push(models.Agent.create(agentBindingResult.validatedData, {transaction}));
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
                    return res.json(AppResponseDto.buildSuccessWithMessages('Agent registered successfully'))
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

exports.agencyRegisterAgent = async (req, res) => {
    const body= req.body;
    let currentUser = req.body.owner_id;
    console.log(currentUser)
    const agency = await models.UserCompany.findOne({where: {user_id: currentUser}})


    console.log(agency)
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
    agentBindingResult.validatedData.agency_id = agency.company_id;

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
            const role = "ADMIN_AGENT";
            const roleDescription = "This role belongs agents in general."

            promises.push(models.Roles.findOrCreate({
                where: {name: role},
                defaults: {description: roleDescription}
            }));
            bindingResult.validatedData.IsApproved = true;
            promises.push(models.Users.create(bindingResult.validatedData, {transaction}));
            promises.push(models.Agent.create(agentBindingResult.validatedData, {transaction}));
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
                    return res.json(AppResponseDto.buildSuccessWithMessages('Agent registered successfully'))
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

exports.getAgentsByAgencyId = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    // Promise.all([
    //     models.Agent.findAll({
    //         where: {agency_id: req.param.agent_load_ids},
    //         include:[
    //             {
    //                 model: models.Users,
    //                 include: [{model: models.ProfilePicture}]
    //             }
    //         ],
    //         offset: (page - 1) * pageSize,
    //         limit: pageSize,
    //     }),
    //     models.Agent.findAndCountAll({where: {agency_id: req.param.agent_load_ids},attributes:['id']})
    // ]).then((results) => {
    //     const agents = results[0];
    //     const agentsCount = results[1].count;
    //     return res.json(AgentResponseDto.buildPagedList(agents, page, pageSize,agentsCount, req.baseUrl))
    // }).catch(err => {
    //     return res.json(AppResponseDto.buildWithErrorMessages(err.message))
    // })
    return res.json('Hello')
}

exports.getAgentProperties = (req, res) => {
    const agent_id = req.params.agent_id
    let properties = [];

    models.AgentProperty.findAll({where: {agent_id}}).then((result) => {
        properties.push(result.property_id)
    }).catch(err => {
        return AppResponseDto.buildWithErrorMessages(err)
    })

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.Property.findAll({
            where:{id: properties},
            offset: 0,
            limit: 5,
            order: [
                ['createdAt','DESC']
            ],
            attributes: ['id', 'property_name', 'property_slug', 'property_description', 'property_location', 'property_code','createdAt','updatedAt'],
            include: [
                {
                    model: models.Users,
                    exclude: ['createdAt', 'updatedAt']
                },
                {
                    model: models.Country,
                    exclude: ['createdAt', 'updatedAt']
                },
                {
                    model: models.Category
                },
                {
                    model: models.PropertyImage
                },
                {
                    model: models.Unit,
                    include: [{model: models.UnitType}]
                },
                {
                    model: models.Company
                }
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        }),
        models.Property.findAndCountAll({attributes: ['id']})
    ]).then(results => {
        const property = results[0];
        const propertyCount = results[1].count;
        return res.json(PropertyResponseDto.buildPagedList(property, page, pageSize, propertyCount, req.baseUrl))
    }).catch(err => {
        res.json(AppResponseDto.buildWithErrorMessages(err.message));
    })
}
