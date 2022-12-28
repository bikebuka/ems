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
        return {agents: []};
    return {
        agents: owners.map(owner=>buildDto(owner,true))
    }
}

function buildDto(owner, includeUrls = false){


    const summary = {
        id: owner.id,
        first_name: owner.first_name,
        last_name: owner.last_name,
        email_address: owner.email_address,
        phone_number: owner.phone_number,
        username: owner.username,
        description: owner.description,
        is_active: owner.is_active,
        created_at: owner.createdAt,
        created_by: owner.created_by
        //user_id: owner.Users.map(user => user.id).toString()
    };
    if(includeUrls && owner.images){
        summary.image_urls = owner.images.map(image=>image.file_path);
    }
    return summary;
}

function agentBasic(details) {
    return {
        id: details.id,
        first_name: details.first_name,
        last_name: details.last_name
    }
}

function agentBasicDto(details) {
    if(!details)
        return {agents: []};
    return {
        agents: details.map(owner=>agentBasic(owner,true))
    }
}

module.exports = {
    buildDto,buildDtos, buildPagedList, buildNonPagedList, agentBasicDto
}
