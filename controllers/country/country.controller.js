const models = require("../../models");
const AppResponseDto = require('../../dto/response/app.response.dto');
const CountryResponseDto = require('../../dto/response/country.response.dto');

exports.getAllCountries = (req,res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    Promise.all([
        models.Country.findAll({
            order:[
                'name','short_name'
            ],
            attributes: ['id','name','slug','short_name'],
            offset: (page - 1) * pageSize,
            limit: pageSize,
        }),
        models.Country.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        const countries = results[0];
        const countriesCount = results[1].count;
        return res.json(CountryResponseDto.buildPagedList(countries, page, pageSize,countriesCount, req.baseUrl))
    }).catch(err=>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}

exports.getAllCountriesNoPage = (req,res, next) => {
    Promise.all([
        models.Country.findAll({
            order:[
                'name','short_name'
            ],
            attributes: ['id','name','slug','short_name'],
        }),
        models.Country.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        const countries = results[0];
        const countriesCount = results[1].count;
        return res.json(CountryResponseDto.buildNonPagedList(countries, countriesCount))
    }).catch(err=>{
        return res.json(AppResponseDto.buildWithErrorMessages(err))
    })
}
