const PageMetaDto = require('./page_meta.dto');
const UserDto = require('./user.response.dto');
const models = require('../../models');
const ProfilePictureDto = require('../../dto/response/profile.picture.response.dto')

function buildPagedList(companies,page,pageSize,totalCountryCount, basePath){
    return {
        success: true,
        page_meta: PageMetaDto.build(companies.length,page,pageSize,totalCountryCount,basePath),
        ...buildDtos(companies),
    }
}

function buildNonPagedList(companies, totalCompanyCount){
    return {
        ...buildDtos(companies)
    }
}

function buildDtos(companies){
    if(!companies)
        return {companies: []};
    return {
        companies: companies.map(company=>buildDto(company,true))
    }
}

function buildDto(company, includeUrls = false){
    const summary = {
        id: company.id,
        company_name: company.company_name,
        company_slug:company.company_slug,
        office_email: company.office_email,
        office_phone: company.office_phone,
        office_cell: company.office_cell,
        office_name: company.office_name,
        building_name: company.building_name,
        road_street:  company.road_street,
        office_floor: company.office_floor,
        website: company.website,
        address_1: company.address_1,
        address_2: company.address_2,
        description: company.description,
        ...UserDto.buildBasicDtos(company.Users)
        // user_id: company.Users.map(user => user.id).toString()
        // ...UserDto.buildBasicInfo(company.Users[0])

    };
    if(includeUrls && company.images){
        summary.image_urls = company.images.map(image=>image.file_path);
    }
    return summary;
}

function buildBasicInfo(company) {
    const summary = {
        id: company.id,
        company_name: company.company_name,
        company_slug:company.company_slug,
        office_email: company.office_email,
        office_phone: company.office_phone,
        office_cell: company.office_cell,
        office_name: company.office_name,
        building_name: company.building_name,
        road_street:  company.road_street,
        office_floor: company.office_floor,
        website: company.website,
        address_1: company.address_1,
        address_2: company.address_2,
        description: company.description,
    }
    return summary
}

async function getById(id) {
    const company = await models.Company.findOne({where: {id: id}});
    const summary = {
        id: company.id,
        company_name: company.company_name,
        company_slug:company.company_slug,
        office_email: company.office_email,
        office_phone: company.office_phone,
        office_cell: company.office_cell,
        office_name: company.office_name,
        building_name: company.building_name,
        road_street:  company.road_street,
        office_floor: company.office_floor,
        website: company.website,
        address_1: company.address_1,
        address_2: company.address_2,
        description: company.description,
    };
    return summary;
}

function companyDetails(details) {
    const summary = {
        user_id: details.id,
        first_name: details.first_name,
        last_name: details.last_name,
        email_address: details.email_address,
        phone_number: details.phone_number,
        description: details.description,
        username: details.username,
        is_active: details.IsActive,
        is_approved: details.IsApproved,
        created_at: details.createdAt,
        updated_at: details.updatedAt,
        ...ProfilePictureDto.buildDtos(details.ProfilePictures),
        ...buildDtos(details.Companies)
    }
    return summary
}



module.exports = {
    buildDto,buildDtos, buildPagedList, buildNonPagedList, getById, buildBasicInfo, companyDetails
}
