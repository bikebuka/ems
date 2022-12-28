function onlyToken(refresh) {
    return {token: refresh.get('token')}
}

function toNameList(refreshes) {
    if(refreshes == null) return [];
    return refreshes.map(r => r.token)
}

function buildDto(role) {
    return {
        id: role.id,
        name: role.name
    }
}

module.exports = {toNameList}
