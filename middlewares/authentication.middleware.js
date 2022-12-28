const jwt = require('jsonwebtoken')
const models = require('../models/')
const AppResponseDto = require('../dto/response/app.response.dto')

async function auth(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '')
    let data = null;
    try{
        data = await jwt.verify(token, process.env.JWT_KEY)
    }catch (e){
        return res.json(AppResponseDto.buildWithErrorMessages('Access token is expired'))
    }
    try {
        const user = await models.Users.findOne({
            where: { id: data.userId },
            include: [
                {
                    model: models.Roles,
                    attributes: ['name','id'],
                    include: [{
                        model: models.Permission,
                        attributes: ['id', 'permission_name', 'permission_description']
                    }]
                }
            ]
        })
        if (!user) {
            return  new Error("Can't find the user specified in token");
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = auth
