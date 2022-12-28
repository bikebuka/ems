const PageMetaDto = require('./page_meta.dto');
const CategoryDto = require('./categories.response.dto');
const CountryDto = require('./country.response.dto')
const UserDto = require('./user.response.dto')
const UnitDto = require('./unit.reponse.dto')
const CompanyDto = require('./company.response.dto')

function registerPropertyDto(property) {
    return {
        success: true,
        full_message: ['Property registered successfully']
    };
}

function buildPagedList(properties,page,pageSize,totalPropertyCount, basePath){
    return {
        success: true,
        page_meta: PageMetaDto.build(properties.length,page,pageSize,totalPropertyCount,basePath),
        ...buildDtos(properties),
    }
}

function buildNonPagedList(properties, totalPropertyCount){
    return {
        ...buildDtos(properties)
    }
}

function buildDtos(properties){
    if(!properties)
        return {properties: []};
    return {
        properties: properties.map(property=>buildDto(property,true))
    }
}

function buildDto(property, includeUrls = false){
    const summary = {
        id: property.id,
        property_name: property.property_name,
        property_slug:property.property_slug,
        property_description: property.property_description,
        property_location: property.property_location,
        property_code: property.property_code,
        ...CategoryDto.buildDtos(property.Categories),
        ...CountryDto.buildDtos(property.Countries),
        ...UserDto.buildDtos(property.Users),
        ...UnitDto.buildDtos(property.Units),
        property_agency: property.agency_id,
        image_urls: property.PropertyImages?property.PropertyImages.map(image => image.file_path) : [],
        created_at: property.createdAt,
        updated_at: property.updatedAt,
    };
    if(includeUrls && property.images){
        summary.image_urls = property.images.map(image=>image.file_path);
    }
    return summary;
}

module.exports = {
    buildDto,buildDtos, buildPagedList, buildNonPagedList, registerPropertyDto
}
