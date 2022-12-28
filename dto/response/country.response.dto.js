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

function buildDtos(countries){
    if(!countries)
        return {countries: []};
    return {
        countries: countries.map(country=>buildDto(country,true))
    }
}

function buildDto(country, includeUrls = false){
    const summary = {
        id: country.id,
        name: country.name,
        slug:country.slug,
        short_name: country.short_name
    };
    if(includeUrls && country.images){
        summary.image_urls = country.images.map(image=>image.file_path);
    }
    return summary;
}

module.exports = {
    buildDto,buildDtos, buildPagedList, buildNonPagedList
}
