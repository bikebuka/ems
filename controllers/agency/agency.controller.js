const models =require('../../models');
const AppResponseDto =  require('../../dto/response/app.response.dto');
const CountryResponseDto = require("../../dto/response/country.response.dto");
const CompanyResponseDto = require("../../dto/response/company.response.dto")
const UserRequestDto = require("../../dto/request/user.request.dto");
const CompanyRequestDto = require("../../dto/request/company.request.dto");
const _ = require("lodash");
const {sequelize} = require("../../models");
const AdminRegisterUserMailer = require("../../helpers/mailers/register.user.helper");
const PropertyResponseDto = require("../../dto/response/property.response.dto");
const Op = require('../../models/index').Sequelize.Op;
const AgentResponseDto = require('../../dto/response/agent.response.dto')


exports.registerAgency = (req, res, next) => {
    const body = req.body;
    console.log(body)
    // const userBindingResult = UserRequestDto.createUserRequestDto(req.body);
    const bindingResult = UserRequestDto.createUserRequestDto(req.body);
    const companyBindingResult = CompanyRequestDto.createCompanyRequestDto(req.body);
    const promises = [];

    if(!_.isEmpty(bindingResult.errors)){
        return res.json(AppResponseDto.buildWithErrorMessages(bindingResult.errors))
    }
    if(!_.isEmpty(companyBindingResult.errors)){
        return res.json(AppResponseDto.buildWithErrorMessages(companyBindingResult.errors))
    }
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
            const country = req.body.country || "Kenya";
            const role = "ADMIN_AGENCY";
            const roleDescription = "This is the role meant for agency administrators."

            promises.push(models.Roles.findOrCreate({
                where: {name: role},
                defaults: {description: roleDescription}
            }));

            promises.push(models.Country.findOrCreate({
                where: {name: country},
            }));

            bindingResult.validatedData.IsApproved = true;
            promises.push(models.Users.create(bindingResult.validatedData, {transaction}));
            promises.push(models.Company.create(companyBindingResult.validatedData, {transaction}));

            await Promise.all(promises).then(async results => {
                console.log('Results')
                console.log(results)
                promises.length = 0;
                const company = results.pop();
                const user = results.pop();
                const role = [];
                const country = [];

                results.forEach(result => {
                    if(result[0].constructor.getTableName() === 'Roles')
                        role.push(result[0])
                    else if(result[0].constructor.getTableName() === 'Countries')
                        country.push(result[0])
                })

                promises.push(user.setRoles(role, {transaction}))
                promises.push(company.setUsers(user, {transaction}))
                promises.push(company.setCountries(country, {transaction}))

                for(let i = 0; req.files != null && i < req.files.length; i++){
                    let file = req.files[i];
                    let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
                    filePath = filePath.replace('public','');
                    promises.push(models.ProfilePicture.create({
                        file_name: file.filename,
                        file_path: filePath,
                        original_name: file.originalname,
                        file_size: file.size,
                        user_id: user.id
                    },{transaction: transaction}))
                }

                await Promise.all(promises).then(results => {
                    user.images = _.takeRightWhile(results, result => {
                        return result.constructor.getTableName && result.constructor.getTableName() === 'ProfilePictures'
                    });
                    user.roles = role;
                    company.users = user;
                    company.countries = country;
                    transaction.commit();
                    AdminRegisterUserMailer.send(user.email_address, `${user.last_name}`, user.username, bindingResult.validatedData.password);
                    return res.json(AppResponseDto.buildSuccessWithDto(CompanyResponseDto.buildBasicInfo(company),'Agency registered successfully'))
                }).catch(err => {
                    console.log(err);
                    return res.json(AppResponseDto.buildWithErrorMessages(err))
                })
            }).catch(err => {
                console.log(err);
                return res.json(AppResponseDto.buildWithErrorMessages(err))
            })
        }).catch(err => {
            console.log(err);
            return res.json(AppResponseDto.buildWithErrorMessages(err))
        })
    })
}

exports.getAgencies = (req, res) => {
    Promise.all([
        models.Company.findAll({
            order:[
                'company_name'
            ],
            include: [
                {model: models.Users}
            ],
        }),
        models.Company.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        const companies = results[0];
        const companiesCount = results[1].count;
        return res.json(CompanyResponseDto.buildNonPagedList(companies, companiesCount))
    }).catch(err=>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getAllAgenciesPaginated = (req,res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.Company.findAll({
            order:[
                'company_name'
            ],
            include: [
                {model: models.Users}
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize,
        }),
        models.Company.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        const companies = results[0];
        const companiesCount = results[1].count;
        return res.json(CompanyResponseDto.buildPagedList(companies, page, pageSize,companiesCount, req.baseUrl))
    }).catch(err=>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getAgencyById = (req, res, next) => {
    models.Company.findOne({
        where: {id: req.agency.id},
        include:[
            {
                model: models.Users,
                include: [{model: models.ProfilePicture}]
            }
        ]
    }).then((agency) => {
        return res.json(CompanyResponseDto.buildDto(agency))
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err.message))
    })
}

exports.getAgencyProperties = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.Property.findAll({
            where: {agency_id: req.params.agency_id},
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

exports.assignPropertyToAgent = async (req, res) => {
    const agent_id = req.body.agent_id;
    const property_id = req.body.property_id;

    if (!agent_id || !property_id) {
        res.status(400).send({error: 'You need a email and password'});
        return;
    }

    const property = await models.Property.findOne({where: {id: property_id}});
    debugger
    const agent = await models.Agent.findOne({where: {id: agent_id}, attributes: ['id', 'first_name', 'last_name', 'email_address', 'phone_number']});

    if(property.length < 1){
        res.status(400).send({error: 'Property not found'});
        return;
    }
    if(agent.length < 1){
        res.status(400).send({error: 'Agent not found'});
        return;
    }

    await models.AgentProperty.findOne({
        where: {
            [Op.and]: [{agent_id}, {property_id}]
        }
    }).then((details) => {
        if(details){
            const errors = {};
            errors.detail = 'Property is already assigned to agent'
            if (!_.isEmpty(errors)) {
                return res.status(403).json(AppResponseDto.buildWithErrorMessages(errors));
            }
        }
        models.AgentProperty.create({
            agent_id:agent_id,
            property_id: property_id
        }).then((results) => {
            return res.json(AppResponseDto.buildSuccessWithMessages('Property assigned successfully to an agent'))
        }).catch(err => {
            res.json(AppResponseDto.buildWithErrorMessages(err.message));
        })
    }).catch(err => {
        res.json(AppResponseDto.buildWithErrorMessages(err.message));
    })
}

exports.getAgents = (req, res) => {
    let currentUser = req.params.id;

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.Agent.findAll({
            where: {agency_id: currentUser},
            offset: 0,
            limit: 5,
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                {
                    model: models.Users,
                    include:[{model: models.ProfilePicture}]
                }

            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        }),
        models.Agent.findAndCountAll({where:{agency_id: currentUser}, attributes: ['id']})
    ]).then(results => {
        const agents = results[0];
        const agentsCount = results[1].count

        return res.json(AgentResponseDto.buildPagedList(agents, page, pageSize, agentsCount, req.baseUrl))
    }).catch(err =>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getAgentsNoPagination  =(req, res) => {
    let currentUser = req.params.id;

    models.Agent.findAll({
        where: {agency_id: currentUser},
    }).then(result => {
        return res.json(AgentResponseDto.agentBasicDto(result));
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getCompanyDetails = (req, res) => {
    const currentUser = req.params.id;

    models.Users.findOne({
        where: {id: currentUser},
        include: [
            {
                model: models.Company
            },
            {
                model: models.ProfilePicture
            }
        ]
    }).then(results => {
        console.log(results)
        return res.json(CompanyResponseDto.companyDetails(results))
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}
