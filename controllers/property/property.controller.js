const models = require('../../models');
const _ = require('lodash');
const Op = require('../../models/index').Sequelize.Op;
const sequelize = require('../../models/index').sequelize;
const AppResponseDto = require('../../dto/response/app.response.dto');
const PropertyRequestDto = require('../../dto/request/property.request.dto');
const PropertyResponseDto = require('../../dto/response/property.response.dto');
const UnitResponseDto = require('../../dto/response/unit.reponse.dto')
const CheckPermission = require('../../helpers/permissions/check.permissions');
const helper = new CheckPermission();

exports.getAll = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.Property.findAll({
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

exports.getPropertyBySlugOrId = (req, res, next) => {
    const query = _.assign(req.query, {
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
            }
        ],
    });
    models.Property.findOne(query).then(property => {
        return res.json(PropertyResponseDto.buildDto(property))
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err.message))
    })
}


exports.createProperty = (req, res) => {
    // helper.checkPermission(req.user.Roles[0].id,'PROPERTY_CREATE').then(() => {
    //
    // }).catch(err => {
    //     return res.json(AppResponseDto.buildWithErrorMessages('You do not have permission to create property'))
    // })
    let currentUser = req.user.id;
    const bindingResults = PropertyRequestDto.createPropertyRequestDto(req.body);
    bindingResults.validatedData.created_by = currentUser;
    const promises = [];
    if(!_.isEmpty(bindingResults.errors)){
        return res.json(AppResponseDto.buildWithErrorMessages(bindingResults.errors));
    }
    let transac = undefined;
    sequelize.transaction({autocommit: false}).then(async function(transaction){
        transac = transaction;
        const categories = req.body.category || [];
        const units = req.body.units || [];

        promises.push(models.Category.findOrCreate({
            where: {name: categories},
            defaults: {description: req.body.category_description}
        }))

        promises.push(models.Country.findOrCreate({
            where: {name: req.body.country}
        }))

        promises.push(models.Users.findOrCreate({
            where: {id: req.body.owner_id}
        }))

        const getUnitTypId = async (unit_type_name) => {
            const unitType = await models.UnitType.findOrCreate({
                where: {unit_type_name: unit_type_name}
            })

            return unitType[0].id
        }
        for(const unit of units){
            promises.push(models.Unit.findOrCreate({
                where: {unit_name:unit.unit_name},
                defaults: {
                    unit_floor: unit.unit_floor,
                    rent_amount: parseFloat(unit.rent_amount),
                    bedrooms: parseInt(unit.bedrooms),
                    unit_type_id: await getUnitTypId(unit.unit_type_name),
                    bathrooms: parseInt(unit.bathrooms),
                    total_rooms: parseInt(unit.total_rooms),
                    square_foot: parseInt(unit.square_foot),
                    created_by: currentUser,
                    is_deleted: false,
                }
            }));
        }

        promises.push(models.Property.create(bindingResults.validatedData, {transaction}));
        await Promise.all(promises).then(async results => {
            console.log(results)
            promises.length = 0;
            const property = results.pop();
            const categories = [];
            const countries = [];
            const units = [];
            const users = [];

            results.forEach(results => {
                if(results[0].constructor.getTableName() === 'Categories')
                    categories.push(results[0])
                else if(results[0].constructor.getTableName() === 'Countries')
                    countries.push(results[0])
                else if(results[0].constructor.getTableName() === "Users")
                    users.push(results[0])
                else if(results[0].constructor.getTableName() === "Units")
                    units.push(results[0])
            })

            promises.push(property.setCategories(categories, {transaction}))
            promises.push(property.setCountries(countries, {transaction}));
            promises.push(property.setUsers(users, {transaction}))
            promises.push(property.setUnits(units,{transaction}))

            for(let i = 0; req.files != null && i < req.files.length; i++){
                let file = req.files[i];
                let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
                filePath = filePath.replace('public','');
                promises.push(models.PropertyImage.create({
                    file_name: file.filename,
                    file_path: filePath,
                    original_name: file.originalname,
                    file_size: file.size,
                    property_id: property.id
                },{transaction: transaction}))
            }

            await Promise.all(promises).then(results => {
                property.images = _.takeRightWhile(results, result => {
                    return result.constructor.getTableName && result.constructor.getTableName() === 'PropertyImages'
                });
                property.categories = categories;
                property.countries = countries;
                property.users = users;
                property.units = units;

                transaction.commit();
                return res.json(AppResponseDto.buildSuccessWithDto(PropertyResponseDto.buildDto(property), 'Property created successfully'))
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

exports.createPropertyOwner = (req, res) => {
    // helper.checkPermission(req.user.Roles[0].id,'PROPERTY_CREATE').then(() => {
    //
    // }).catch(err => {
    //     return res.json(AppResponseDto.buildWithErrorMessages('You do not have permission to create property'))
    // })
    let currentUser = req.user.id;
    const bindingResults = PropertyRequestDto.createPropertyRequestDto(req.body);
    bindingResults.validatedData.created_by = currentUser;
    const promises = [];
    if(!_.isEmpty(bindingResults.errors)){
        return res.json(AppResponseDto.buildWithErrorMessages(bindingResults.errors));
    }
    let transac = undefined;
    sequelize.transaction({autocommit: false}).then(async function(transaction){
        transac = transaction;
        const categories = req.body.category || [];
        const units = req.body.units || [];

        promises.push(models.Category.findOrCreate({
            where: {name: categories},
            defaults: {description: req.body.category_description}
        }))

        promises.push(models.Country.findOrCreate({
            where: {name: req.body.country}
        }))

        promises.push(models.Users.findOrCreate({
            where: {id: currentUser}
        }))

        const getUnitTypId = async (unit_type_name) => {
            const unitType = await models.UnitType.findOrCreate({
                where: {unit_type_name: unit_type_name}
            })

            return unitType[0].id
        }
        for(const unit of units){
            promises.push(models.Unit.findOrCreate({
                where: {unit_name:unit.unit_name},
                defaults: {
                    unit_floor: unit.unit_floor,
                    rent_amount: parseFloat(unit.rent_amount),
                    bedrooms: parseInt(unit.bedrooms),
                    unit_type_id: await getUnitTypId(unit.unit_type_name),
                    bathrooms: parseInt(unit.bathrooms),
                    total_rooms: parseInt(unit.total_rooms),
                    square_foot: parseInt(unit.square_foot),
                    created_by: currentUser,
                    is_deleted: false,
                }
            }));
        }

        promises.push(models.Property.create(bindingResults.validatedData, {transaction}));
        await Promise.all(promises).then(async results => {
            console.log(results)
            promises.length = 0;
            const property = results.pop();
            const categories = [];
            const countries = [];
            const units = [];
            const users = [];

            results.forEach(results => {
                if(results[0].constructor.getTableName() === 'Categories')
                    categories.push(results[0])
                else if(results[0].constructor.getTableName() === 'Countries')
                    countries.push(results[0])
                else if(results[0].constructor.getTableName() === "Users")
                    users.push(results[0])
                else if(results[0].constructor.getTableName() === "Units")
                    units.push(results[0])
            })

            promises.push(property.setCategories(categories, {transaction}))
            promises.push(property.setCountries(countries, {transaction}));
            promises.push(property.setUsers(users, {transaction}))
            promises.push(property.setUnits(units,{transaction}))

            for(let i = 0; req.files != null && i < req.files.length; i++){
                let file = req.files[i];
                let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
                filePath = filePath.replace('public','');
                promises.push(models.PropertyImage.create({
                    file_name: file.filename,
                    file_path: filePath,
                    original_name: file.originalname,
                    file_size: file.size,
                    property_id: property.id
                },{transaction: transaction}))
            }

            await Promise.all(promises).then(results => {
                property.images = _.takeRightWhile(results, result => {
                    return result.constructor.getTableName && result.constructor.getTableName() === 'PropertyImages'
                });
                property.categories = categories;
                property.countries = countries;
                property.users = users;
                property.units = units;

                transaction.commit();
                return res.json(AppResponseDto.buildSuccessWithDto(PropertyResponseDto.buildDto(property), 'Property created successfully'))
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

exports.createPropertyAgency = async (req, res) => {
    // helper.checkPermission(req.user.Roles[0].id,'PROPERTY_CREATE').then(() => {
    //
    // }).catch(err => {
    //     return res.json(AppResponseDto.buildWithErrorMessages('You do not have permission to create property'))
    // })
    let currentUser = req.user.id;
    models.UserCompany.findOne({where: {user_id: currentUser}}).then(result => {
        const bindingResults = PropertyRequestDto.createPropertyRequestDto(req.body);
        bindingResults.validatedData.created_by = currentUser;
        bindingResults.validatedData.agency_id = result.company_id;
        const promises = [];
        if(!_.isEmpty(bindingResults.errors)){
            return res.json(AppResponseDto.buildWithErrorMessages(bindingResults.errors));
        }
        let transac = undefined;
        sequelize.transaction({autocommit: false}).then(async function(transaction){
            transac = transaction;
            const categories = req.body.category || [];
            const units = req.body.units || [];

            promises.push(models.Category.findOrCreate({
                where: {name: categories},
                defaults: {description: req.body.category_description}
            }))

            promises.push(models.Country.findOrCreate({
                where: {name: req.body.country}
            }))

            promises.push(models.Users.findOrCreate({
                where: {id: req.body.owner_id}
            }))

            const getUnitTypId = async (unit_type_name) => {
                const unitType = await models.UnitType.findOrCreate({
                    where: {unit_type_name: unit_type_name}
                })

                return unitType[0].id
            }
            for(const unit of units){
                promises.push(models.Unit.findOrCreate({
                    where: {unit_name:unit.unit_name},
                    defaults: {
                        unit_floor: unit.unit_floor,
                        rent_amount: parseFloat(unit.rent_amount),
                        bedrooms: parseInt(unit.bedrooms),
                        unit_type_id: await getUnitTypId(unit.unit_type_name),
                        bathrooms: parseInt(unit.bathrooms),
                        total_rooms: parseInt(unit.total_rooms),
                        square_foot: parseInt(unit.square_foot),
                        created_by: currentUser,
                        is_deleted: false,
                    }
                }));
            }

            promises.push(models.Property.create(bindingResults.validatedData, {transaction}));
            await Promise.all(promises).then(async results => {
                console.log(results)
                promises.length = 0;
                const property = results.pop();
                const categories = [];
                const countries = [];
                const units = [];
                const users = [];

                results.forEach(results => {
                    if(results[0].constructor.getTableName() === 'Categories')
                        categories.push(results[0])
                    else if(results[0].constructor.getTableName() === 'Countries')
                        countries.push(results[0])
                    else if(results[0].constructor.getTableName() === "Users")
                        users.push(results[0])
                    else if(results[0].constructor.getTableName() === "Units")
                        units.push(results[0])
                })

                promises.push(property.setCategories(categories, {transaction}))
                promises.push(property.setCountries(countries, {transaction}));
                promises.push(property.setUsers(users, {transaction}))
                promises.push(property.setUnits(units,{transaction}))

                for(let i = 0; req.files != null && i < req.files.length; i++){
                    let file = req.files[i];
                    let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
                    filePath = filePath.replace('public','');
                    promises.push(models.PropertyImage.create({
                        file_name: file.filename,
                        file_path: filePath,
                        original_name: file.originalname,
                        file_size: file.size,
                        property_id: property.id
                    },{transaction: transaction}))
                }

                await Promise.all(promises).then(results => {
                    property.images = _.takeRightWhile(results, result => {
                        return result.constructor.getTableName && result.constructor.getTableName() === 'PropertyImages'
                    });
                    property.categories = categories;
                    property.countries = countries;
                    property.users = users;
                    property.units = units;

                    transaction.commit();
                    return res.json(AppResponseDto.buildSuccessWithDto(PropertyResponseDto.buildDto(property), 'Property created successfully'))
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

    //const agencyId = req.body.owner_id
    //console.log(agencyId.company_id)

}
