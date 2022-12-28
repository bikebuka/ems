const PageMetaDto = require('./page_meta.dto');
const UnitTypeDto = require('./unit.type.reponse.dto')
const PropertyResponseDto = require('../response/property.response.dto')

function buildPagedList(units, page, pageSize, totalUnitsCount, basePath) {
    return {
        success: true,
        page_meta: PageMetaDto.build(units.length, page, pageSize, totalUnitsCount, basePath),
        ...buildDtos(units),
    }
}

function buildDtos(units) {
    if (!units)
        return {units: []};
    return {
        units: units.map(unit => buildDto(unit, true))
    }
}

function buildDto(unit, includeUrls = false) {
    return {
        id: unit.id,
        unit_name: unit.unit_name,
        unit_floor: unit.unit_floor,
        rent_amount: unit.rent_amount,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        total_rooms: unit.total_rooms,
        square_foot: unit.square_foot,
        unit_type_id: unit.unit_type_id,
        created_by: unit.created_by,
        updated_by: unit.updated_by,
        is_deleted: unit.is_deleted,
        created_at: unit.createdAt,
        //property :unit?.Properties[0]? unit?.Properties[0]: []
    };
}

module.exports = {
    buildDtos, buildPagedList, buildDto
};
