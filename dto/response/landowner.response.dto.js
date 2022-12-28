const PageMetaDto = require('./page_meta.dto');
const UsersDto  = require('./user.response.dto')

function buildPagedList(owners,page,pageSize,totalOwnerCount, basePath){
    return {
        success: true,
        page_meta: PageMetaDto.build(owners.length,page,pageSize,totalOwnerCount,basePath),
        ...buildDtos(owners),
    }
}

function buildNonPagedList(owners, totalOwnerCount){
    return {
        ...buildDtos(owners)
    }
}

function buildDtos(owners){
    if(!owners)
        return {owners: []};
    return {
        owners: owners.map(owner=>buildDto(owner,true))
    }
}

function buildDto(owner, includeUrls = false){


    const summary = {
        id: owner.id,
        first_name: owner.first_name,
        last_name: owner.last_name,
        email_address: owner.email_address,
        phone_number: owner.phone_number,
        user_id: owner.Users.map(user => user.id).toString()
    };
    if(includeUrls && owner.images){
        summary.image_urls = owner.images.map(image=>image.file_path);
    }
    return summary;
}

module.exports = {
    buildDto,buildDtos, buildPagedList, buildNonPagedList
}
