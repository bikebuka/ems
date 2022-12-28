const PageMetaDto = require('./page_meta.dto');

function buildPagedList(countries,page,pageSize,totalCountryCount, basePath){
    return {
        success: true,
        page_meta: PageMetaDto.build(countries.length,page,pageSize,totalCountryCount,basePath),
        ...buildDtos(countries),
    }
}

function buildNonPagedList(countries, totalCountryCount){
    return {
        ...buildDtos(countries)
    }
}

function buildDtos(picture){
    if(!picture)
        return {picture: []};
    return {
        picture: picture.map(pic=>buildDto(pic,))
    }
}

function buildDto(picture){
    const summary = {
        id: picture.id,
        file_name: picture.file_name,
        file_path: picture.file_path,
        original_name: picture.original_name,
        file_size: picture.file_size,
        created_at: picture.createdAt,
        updated_at: picture.updatedAt
    };

    return summary;
}

module.exports = {
    buildDto,buildDtos, buildPagedList, buildNonPagedList
}
