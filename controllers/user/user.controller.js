const models =require('../../models');
//get all users
exports.index = (req,res) => {
    Promise.all([
        models.User.findAll({
            order:[
                'createdAt'
            ],
        }),
        models.User.findAndCountAll({attributes:['id']})
    ]).then(results=>{
        console.log(results)
        const data = results.shift();
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved the list of users",
                data
            })
    }).catch(error=>{
        return res.status(500)
            .json({
                success: true,
                message:"Users could not be retrieved",
                error
            })
    })
}
//single user
exports.show = (req, res) => {
    models.User.findOne({
        where: {id: req.params.id},
    }).then((user) => {
        //
        if (user===null) {
            return res.status(404)
                .json({
                    success: false,
                    message:"No user found with the provided ID",
                })
        }
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved a user",
                data: user
            })
    }).catch(error => {
        return res
            .status(500)
            .json({
                success: false,
                message: 'A user could not be created',
                error
            })
    })
}
