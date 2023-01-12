//single unit
const models = require("../../models");
//user account
exports.myAccount = (req, res) => {
    models.Wallet.findOne({
        where: {id: req.params.id},
        include:[
            {
                model:models.User,
                as:'accountHolder',
            },
        ]
    }).then((unit) => {
        //
        if (unit===null) {
            return res.status(404)
                .json({
                    success: false,
                    message:"My Account Information",
                })
        }
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved an account details",
                data: unit
            })
    }).catch(error => {
        return res
            .status(500)
            .json({
                success: false,
                message: 'An account could not be retrieved',
                error
            })
    })
}
/**
 * Send Money To Agent
 * @param req
 * @param res
 */
exports.sendToAgent = (req, res) => {
    //check if the agent is the one managing the unit
    try{
        const {agentId,userId}=req.body
        //
        const agent=models.Agent.findOne({
            where: {
                id:agentId
            },
            include: [
                {
                    model: models.Unit,
                    as:'Unit'
                }
            ]
        })
        //check if the agent owns this unit
        const tenant=models.Tenant


    }catch (e){

    }
    models.Wallet.findOne({
        where: {id: req.params.id},
        include:[
            {
                model:models.User,
                as:'accountHolder',
            },
        ]
    }).then((unit) => {
        //
        if (unit===null) {
            return res.status(404)
                .json({
                    success: false,
                    message:"My Account Information",
                })
        }
        return res.status(200)
            .json({
                success: true,
                message:"You have successfully retrieved an account details",
                data: unit
            })
    }).catch(error => {
        return res
            .status(500)
            .json({
                success: false,
                message: 'An account could not be retrieved',
                error
            })
    })
}