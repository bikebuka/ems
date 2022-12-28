const _ = require('lodash');
const models = require('../../models');
const sequelize = require('../../models/index').sequelize;
const AppResponseDto = require('../../dto/response/app.response.dto');
const UserRequestDto = require('../../dto/request/user.request.dto');
const UserResponseDto = require('../../dto/response/user.response.dto');
const LandOwnerRequestDto = require('../../dto/request/landowner.request.dto');
const AdminRegisterUserMailer = require("../../helpers/mailers/register.user.helper");
const CompanyResponseDto = require("../../dto/response/company.response.dto");
const LandOwnerResponseDto = require('../../dto/response/landowner.response.dto');
const Op = require('../../models/index').Sequelize.Op;

exports.register = (req, res) => {
    const bindingResult = UserRequestDto.createUserRequestDto(req.body);
    const landOwnerBindingResult = LandOwnerRequestDto.createLandOwnerRequestDto(req.body);

    const promises = [];
    if(!_.isEmpty(bindingResult.errors)){
        return res.json(AppResponseDto.buildWithErrorMessages(bindingResult.errors))
    }
    if(!_.isEmpty(landOwnerBindingResult.errors)){
        return res.json(AppResponseDto.buildWithErrorMessages(landOwnerBindingResult.errors))
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
            if (user.username === req.body.username)
                errors.username = 'username: ' + req.body.username + ' is already taken';

            if (user.email_address === req.body.email_address)
                errors.email_address = 'Email: ' + req.body.email_address + ' is already taken';

            if (user.phone_number === req.body.phone_number)
                errors.phone_number = 'Phone number: ' + req.body.phone_number + ' is already taken';

            if (!_.isEmpty(errors)) {
                return res.status(403).json(AppResponseDto.buildWithErrorMessages(errors));
            }
        }

        let transac = undefined;
        sequelize.transaction({autocommit: false}).then(async function (transaction){
            transac = transaction;
            const role = "ADMIN_OWNER";
            const roleDescription = "This role belongs landlords, landladies, and landowners in general."

            promises.push(models.Roles.findOrCreate({
                where: {name: role},
                defaults: {description: roleDescription}
            }));
            bindingResult.validatedData.IsApproved = true;
            promises.push(models.Users.create(bindingResult.validatedData, {transaction}));
            promises.push(models.LandOwner.create(landOwnerBindingResult.validatedData, {transaction}));
            await Promise.all(promises).then(async results => {
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
                    let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
                    filePath = filePath.replace('public', '');
                    promises.push(models.ProfilePicture.create({
                        fileName: file.filename,
                        filePath: filePath,
                        originalName: file.originalname,
                        fileSize: file.size,
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
                    return res.json(AppResponseDto.buildSuccessWithMessages('Land Owner registered successfully'))
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

exports.getOwners = (req, res) => {
    Promise.all([
        models.LandOwner.findAll({
            include: {
                model: models.Users
            }
        }),
        models.LandOwner.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        const owners = results[0];
        const ownersCount = results[1].count;
        return res.json(LandOwnerResponseDto.buildNonPagedList(owners, ownersCount))
    }).catch(err=>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getAllPaginated = (req,res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.LandOwner.findAll({
            offset: (page - 1) * pageSize,
            limit: pageSize,
            include: [
                {
                    model: models.Users
                }
            ]
        }),
        models.LandOwner.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        const owners = results[0];
        const ownersCount = results[1].count;
        console.log(JSON.stringify(owners.Users))
        return res.json(LandOwnerResponseDto.buildPagedList(owners, page, pageSize,ownersCount, req.baseUrl))
    }).catch(err=>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}
