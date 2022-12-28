const PageMetaDto = require('./page_meta.dto');
const models = require('../../models')

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
        units_type: units.map(unit => buildDto(unit, true))
    }
}

function buildDto(unit) {
    return {
        id: unit.id,
        unit_type_name: unit.unit_type_name,
        unit_type_slug: unit.unit_type_slug,
        unit_type_description: unit.unit_type_description,
        created_by: unit.created_by,
        updated_by: unit.updated_by,
        is_deleted: unit.is_deleted,
        created_at: unit.createdAt,
    };
}

async function unitTypeById(id) {
    await models.UnitType.findOne({where: {id}}).then((unit) => {
       if(unit === null){
           console.log(unit)
           return {units_type: []};
       }
        return {
            units_type: buildDto(unit)
        }
    }).catch(err => {
        return {unit_type: []}
    })
}
module.exports = {
    buildDtos, buildPagedList, buildDto, unitTypeById
};
