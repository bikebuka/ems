const _ = require('lodash');
const crypto = require('crypto');
const models = require('../../models');
const sequelize = require('../../models/index').sequelize;
const Op = require('../../models/index').Sequelize.Op;
const UserResponseDto = require('../../dto/response/user.response.dto')
const UserRequestDto = require('../../dto/request/user.request.dto');
const CompanyRequestDto = require('../../dto/request/company.request.dto')
const VerificationMailer = require('../../helpers/mailers/verification.helper.mailer');
const AdminRegisterUserMailer = require('../../helpers/mailers/register.user.helper');
const AppResponseDto = require('../../dto/response/app.response.dto');
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
    const body = req.body;
    const resultBinding = UserRequestDto.createUserRequestDto(req.body);
    if(!_.isEmpty(resultBinding.errors)){
        return res.status(422).json(AppResponseDto.buildWithErrorMessages(resultBinding.errors));
    }
    const email_address =  resultBinding.validatedData.email_address;
    const phone_number = resultBinding.validatedData.phone_number;
    const username = resultBinding.validatedData.username;
    const hash = crypto.createHmac('sha256',email_address).update('Property-Management-API').digest('hex');

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
                errors.email_address = 'Email: ' + body.email + ' is already taken';

            if (user.phone_number === body.phone_number)
                errors.phone_number = 'Phone number: ' + body.phone_number + ' is already taken';

            if (!_.isEmpty(errors)) {
                return res.status(403).json(AppResponseDto.buildWithErrorMessages(errors));
            }
        }

        models.Users.create(resultBinding.validatedData).then((user) => {
            if(user === null){
                throw user;
            }
            if(user){
                let hostname = req.headers.host;
                let url = null;
                if(process.env.NODE_ENV === 'production'){
                    url = `https://${hostname}/api/V1/users/confirm/${hash}`;
                }else{
                    url = `http://localhost:${process.env.API_PORT}/api/${process.env.API_VERSION}/users/confirm/${hash}`
                }
                console.dir(user)
                console.log(user.toJSON())
                res.json(UserResponseDto.registerDto(user));
                VerificationMailer.send(email_address, hash, url).then(r => console.log('Success'));
            }
            else{
                console.log('user is empty')
            }
        }).catch(err => {
            return res.status(400).send(AppResponseDto.buildWithErrorMessages(err))
        })
    }).catch(err => {
        return res.status(400).send(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.confirm = (req, res) => {
    models.Authenticate.findOne({
        where: {token: req.params.ehash},
        attributes: ['createdAt','email_address', "is_used"]
    }).then((info) => {
        const oneHour = 1000 * 60;
        if(Date() - info.get('createdAt') > oneHour ){
            return res.status(409).json(AppResponseDto.buildWithErrorMessages('Verification link expired'))
        }
        if(info.get('is_used') === true){
            return res.status(200).json(AppResponseDto.buildWithErrorMessages('Verification link already used'));
        }
        else{
            models.Users.update(
                {IsApproved: true, IsActive: true},
                {where: {email_address: info.get('email_address')}}
            ).then((rows) => {
                models.Authenticate.update(
                    {is_used: true},
                    {where: {email_address: info.get('email_address')}}
                ).then(() => {
                    res.status(200).json(AppResponseDto.buildSuccessWithMessages('Account verified successfully'));
                }).catch(err=> res.json(AppResponseDto.buildWithErrorMessages(err)))
            })
        }
    }).catch(err=>{
        res.json(AppResponseDto.buildWithErrorMessages(err));
    })
}

exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password){
        res.status(400).send({error:'You need a username and password'});
        return;
    }
    models.Users.findOne({
        where: {[Op.or]:[{email_address: username},{phone_number:username},{username}],},
        include: [
            {
                model: models.Roles,
                attributes: ['name','id'],
                include: [{
                    model: models.Permission,
                    attributes: ['id', 'permission_name', 'permission_description']
                }],
            },
            {
                model: models.RefreshToken,
                attributes: ['token']
            }
        ]
    }).then(function (user) {
        if(user && user.isValidPassword(password) && user.IsApproved === true && user.IsActive === true){
            req.user = user;
            return res.status(200).json(UserResponseDto.loginSuccess(user));
        }else if(user && user.isValidPassword(password) && user.IsApproved === true && user.IsActive === false){
            return res.status(401).json(AppResponseDto.buildWithErrorMessages('This account is suspended. Contact admin'));
        }else if(user && user.isValidPassword(password) && user.IsApproved === false && user.IsActive === true){
            return res.status(401).json(AppResponseDto.buildWithErrorMessages('Please verify your account before you continue'));
        }else if(user && !user.isValidPassword(password) && user.IsApproved === true && user.IsActive === true){
            return res.status(401).json(AppResponseDto.buildWithErrorMessages('Wrong password provided'));
        }else{
            return res.json(AppResponseDto.buildWithErrorMessages('Multi test failures. Try again!'))
        }
    }).catch(err => {
        res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.refreshUserToken = async (req, res) => {
    const requestToken = req.body.refresh_token;
    if (requestToken === null) {
        return res.status(403).json(AppResponseDto.buildWithErrorMessages("Refresh Token is required!")) ;
    }
    try{
        let refreshToken = await models.RefreshToken.findOne({where: {token: requestToken}});
        if (!refreshToken) {
            res.status(403).json(AppResponseDto.buildWithErrorMessages('Refresh token is not in database!'));
            return;
        }
        if (models.RefreshToken.verifyExpiration(refreshToken)) {
            models.RefreshToken.destroy({ where: { id: refreshToken.id } });
            res.status(403).json(AppResponseDto.buildWithErrorMessages('Refresh token was expired. Please make a new signin request!'));
            return;
        }
        const user = refreshToken.user_id;
        console.log('USer id - '+user)
        const getUser = await models.Users.findOne({where: {id: user},include: [
                {
                    model: models.Roles,
                    attributes: ['name','id'],
                    include: [{
                        model: models.Permission,
                        attributes: ['id', 'permission_name', 'permission_description']
                    }],
                },
                {
                    model: models.RefreshToken,
                    attributes: ['token']
                }
            ]});
        let newAccessToken = jwt.sign(
            {
                userId: user,
                username: getUser.username,
                roles: getUser.Roles.map(role => role.id)
            },
            process.env.JWT_KEY || 'JWT_SUPER_SECRET',
            {expiresIn: process.env.EXPIRE_TIME || '300s'}
        );

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    }catch (e) {
        return res.status(500).json(AppResponseDto.buildWithErrorMessages(e))
    }
}

exports.logout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(204).json(AppResponseDto.buildSuccessWithMessages('No content'))
    const refreshToken = cookies.jwt;
    const foundUser = await models.Users.findOne({
        where: {refresh_token: refreshToken},
        include: [
            {
                model: models.Roles,
                attributes: ['name']
            }
        ]
    })
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true })
        return res.status(204).json(AppResponseDto.buildSuccessWithMessages('Logout success'))
    }
    const otherUsers = await models.Users.findOne({
        where: {refresh_token: !foundUser.refreshToken},
        include: [
            {
                model: models.Roles,
                attributes: ['name']
            }
        ]
    })
    await models.Users.update(
        {refresh_token:null},
        {where: {id: foundUser.id}}
    ).then((res) => {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.status(204).json(AppResponseDto.buildSuccessWithMessages('Logout successful'))
    })
}

exports.forgetPassword = (req, res) => {
    const email_address = req.body.email_address.toLocaleLowerCase();
}

exports.uploadUserProfilePicture = (req, res) => {

}

exports.adminRegisterUser = (req, res) => {
    const body = req.body;
    const bindingResult = UserRequestDto.createUserRequestDto(req.body);
    const promises = [];
    if(!_.isEmpty(bindingResult.errors)){
        return res.json(AppResponseDto.buildWithErrorMessages(bindingResult.errors))
    }

    const email_address = bindingResult.validatedData.email_address;
    const username = bindingResult.validatedData.username;
    const phone_number = bindingResult.validatedData.phone_number;

    models.Users.findOne({
        where: {
            [Op.or]: [{email_address},{username},{phone_number}]
        }
    }).then((user) => {
        if(user){
            const errors = {};
            if(user.username === body.username){
                errors.username = `Username ${body.username} is already taken`;
            }
            if(user.email_address === body.email_address){
                errors.email_address = `Email address ${body.email_address} is already taken`;
            }
            if(user.phone_number === body.phone_number){
                errors.phone_number = `Phone number ${body.phone_number} is already taken`;
            }
            if(!_.isEmpty(errors)){
                return res.status(403).json(AppResponseDto.buildWithErrorMessages(errors));
            }
        }
        bindingResult.validatedData.createdBy = req.user.id;
        let transac = undefined;
        sequelize.transaction({autocommit: false}).then(async (transaction)=> {
            transac = transaction;
            const role = req.body.role || "";
            promises.push(models.Roles.findOrCreate({
                where: {name: role},
                defaults: {description:req.body.role_desc}
            }));

            promises.push(models.Users.create(bindingResult.validatedData, {transaction}));
            await Promise.all(promises).then(async results => {
                promises.length = 0;
                const user = results.pop();
                const roles = [];
                results.forEach(result => {
                    if(result[0].constructor.getTableName() === "Roles")
                        roles.push(result[0])
                });

                promises.push(user.setRoles(roles, {transaction}))

                if(req.files){
                    for(let i = 0; req.files !== null && i < req.files.length; i++){
                        let file = req.files[i];
                        let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
                        filePath = filePath.replace('public', '');
                        promises.push(models.ProfilePicture.create({
                            file_name: file.filename,
                            file_path: filePath,
                            original_name: file.originalname,
                            file_size: file.size,
                            user_id: user.id
                        },{transaction: transaction}));
                    }
                }
                await Promise.all(promises).then(results => {
                    user.roles = roles;
                    transaction.commit();
                    AdminRegisterUserMailer.send(user.email_address, `${user.last_name}`, user.username, bindingResult.validatedData.password);
                    return res.json(AppResponseDto.buildWithDtoAndMessages(UserResponseDto.registerDto(user), 'User registered successfully'))
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

exports.updateUserRole =(req, res) => {

}
