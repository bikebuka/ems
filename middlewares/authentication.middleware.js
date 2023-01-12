const jwt = require('jsonwebtoken')
const models = require('../models/')

async function auth(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    let data = null;
    try{
        data = await jwt.verify(token, process.env.JWT_SECRET)
    }catch (error){
        return res.status(401)
            .json({
                success:false,
                message: "Unauthorised access",
                error
            })
    }
    try {
        const user = await models.User.findOne({
            where: { id: data.id },
            attributes: ["id"]
        })
        if (!user) {
            res.status(404)
                .json({
                    success:false,
                    message: 'Unauthorised access',
                })
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401)
            .json({
                success:false,
                message: 'Not authorized to access this resource',
                error
            })
    }
}
module.exports = auth
