"use strict"

const { HttpCode } = require("../__helpers/types")
const service = require("./playerData.service")

const raceResult = async (req, res, next) => {
    try {
        const code = await service.raceResult({ playerID: req.params.playerID })
        return res.status(HttpCode.OK).send(code)
    } catch (error) {
        return next(error)
    }
}


const checkWallet = async (req, res, next) => {
    try {
        const code = await service.checkWallet({ ...req.body })
        return res.status(HttpCode.OK).send(code)
    } catch (error) {
        return next(error)
    }
}

const removeWallet = async (req, res, next) => {
    try {
        const code = await service.removeWallet({ ...req.body })
        return res.status(HttpCode.OK).send(code)
    } catch (error) {
        return next(error)
    }
}

const updatePlayerXp = async (req, res, next) => {
    try {
        const code = await service.updateXP({ ...req.body })
        return res.status(HttpCode.OK).send(code)
    } catch (error) {
        return next(error)
    }
}

// ... Define routes
module.exports = ({ router }) => {

    router.get("/detail/:playerID", raceResult)
    router.post("/check/wallet", checkWallet)
    router.post("/remove/wallet", removeWallet)
    router.post("/update/xp", updatePlayerXp)
    return router
}

module.exports.isRoot = true