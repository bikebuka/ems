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
const StatisticsResponseDto = require('../../dto/response/statistics.response.dto')

exports.getRentedUnits = async (req, res) => {
    const units = await models.Unit.findAll({where: {is_rented: true}});
    if(!units){
        return res.json(StatisticsResponseDto.buildDto(units))
    }
    return res.json(StatisticsResponseDto.buildDto(units.length))
}

exports.getVacantUnits = async (req, res) => {
    const units = await models.Unit.findAll({
        where: {
            [Op.or]: [{is_rented: false},{is_rented: null}]
        }
    });
    if(!units){
        return res.json(StatisticsResponseDto.buildDto(units))
    }
    return res.json(StatisticsResponseDto.buildDto(units.length))
}

exports.getExpectedRent = async (req, res) => {
    const amount = await models.Unit.findAll({
        where: {is_rented: true},
        attributes: [
            'id',
            [sequelize.fn('sum', sequelize.col('rent_amount')), 'total_amount']
        ],
        group: ['id'],
        raw: true
    })
    if(!amount){
        return res.json(StatisticsResponseDto.buildDto(amount))
    }
    return res.json(StatisticsResponseDto.buildDto(amount))
}

exports.getPaidAmount = async (req, res) => {
    const amount = await models.RentHistory.findAll({
        attributes: [
            'id',
            [sequelize.fn('sum', sequelize.col('amount_paid')), 'total_amount']
        ],
        group: ['id'],
        raw: true
    })
    if(!amount){
        return res.json(StatisticsResponseDto.buildDto(amount))
    }
    return res.json(StatisticsResponseDto.buildDto(amount))
}

exports.getAgencyVacantUnits = (req, res) => {
    const currentUser = req.user.id;
    const property_id = []
    models.UserCompany.findOne({where: {user_id: currentUser}})
        .then(results => {
        if(results !== null){
            models.Property.findAll({where: {agency_id: results.company_id}, include:[{model:models.Unit}]}).then((results2) => {
                console.log(results2)
                let sum = 0;
                let units = [];
                let forUnits = null;
                if(results2 !== null){
                    for (let i=0;i<results2.length;i++){
                        units.push(results2[i].Units)
                    }
                    let unitArray = units[0]
                    for(let i=0;i<unitArray.length;i++){
                        if(unitArray[i].is_rented === true){
                            sum += 1;
                        }
                    }
                    return res.json(AppResponseDto.buildSuccessWithMessages(sum.toString()))
                    //return res.json(AppResponseDto.buildSuccessWithMessages(sum.toString()))
                }else{
                    return res.json(AppResponseDto.buildSuccessWithMessages('0'))
                }
            }).catch(err => {
                return res.json(AppResponseDto.buildWithErrorMessages(err))
            })
        }else{
            return res.json(AppResponseDto.buildSuccessWithMessages('0'))
        }
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}


exports.getAgencyRentedUnits = (req, res) => {
    const currentUser = req.user.id;
    const property_id = []
    models.UserCompany.findOne({where: {user_id: currentUser}}).then(results => {
        if(results !== null){
            models.Property.findAll({where: {agency_id: results.company_id}, include:[{model:models.Unit}]}).then((results2) => {
                console.log(results2)
                let sum = 0;
                let units = [];
                let forUnits = null;
                if(results2 !== null){
                    for (let i=0;i<results2.length;i++){
                        units.push(results2[i].Units)
                    }
                    let unitArray = units[0]
                    for(let i=0;i<unitArray.length;i++){
                        if(unitArray[i].is_rented !== true){
                            sum += 1;
                        }
                    }
                    return res.json(AppResponseDto.buildSuccessWithMessages(sum.toString()))
                    //return res.json(AppResponseDto.buildSuccessWithMessages(sum.toString()))
                }else{
                    return res.json(AppResponseDto.buildSuccessWithMessages('0'))
                }
            }).catch(err => {
                return res.json(AppResponseDto.buildWithErrorMessages(err))
            })
        }else{
            return res.json(AppResponseDto.buildSuccessWithMessages('0'))
        }
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getAgencyExpectedRent = (req, res) => {
    const currentUser = req.user.id;
    models.UserCompany.findOne({where: {user_id: currentUser}}).then(results => {
        if(results !== null){
            models.Property.findAll({where: {agency_id: results.company_id}, include:[{model:models.Unit}]}).then((results2) => {
                let sum = 0;
                let units = [];

                if(results2 !== null){
                    for (let i=0;i<results2.length;i++){
                        units.push(results2[i].Units)
                    }
                    let unitArray = units[0]
                    console.log(unitArray)
                    for(let i=0;i<unitArray.length;i++){
                        if(unitArray[i].is_rented === true){
                            console.log(unitArray[i].rent_amount)
                            sum += unitArray[i].rent_amount
                        }
                    }
                    return res.json(AppResponseDto.buildSuccessWithMessages(sum.toString()))
                }else{
                    return res.json(AppResponseDto.buildSuccessWithMessages('0'))
                }
            }).catch(err => {
                return res.json(AppResponseDto.buildWithErrorMessages(err))
            })
        }else{
            return res.json(AppResponseDto.buildSuccessWithMessages('0'))
        }
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getAgencyCollectedAmount = (req, res) => {
    const currentUser = req.user.id;
    const property_id = []
    models.UserCompany.findOne({where: {user_id: currentUser}}).then(results => {
        if(results !== null){
            models.Property.findAll({where: {agency_id: results.company_id}, include:[{model:models.Unit}]}).then((results2) => {
                console.log(results2)
                let sum = 0;
                let units = [];
                let forUnits = null;
                if(results2 !== null){
                    for (let i=0;i<results2.length;i++){
                        units.push(results2[i].Units)
                    }
                    let unitArray = units[0]
                    for(let i=0;i<unitArray.length;i++){
                        // if(unitArray[i].is_rented !== true){
                        //     sum += ;
                        // }
                    }
                    return res.json(AppResponseDto.buildSuccessWithMessages(sum.toString()))
                    //return res.json(AppResponseDto.buildSuccessWithMessages(sum.toString()))
                }else{
                    return res.json(AppResponseDto.buildSuccessWithMessages('0'))
                }
            }).catch(err => {
                return res.json(AppResponseDto.buildWithErrorMessages(err))
            })
        }else{
            return res.json(AppResponseDto.buildSuccessWithMessages('0'))
        }
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getAgentExpectedRent = (req, res) => {
    const currentUser = req.user.id;


}
