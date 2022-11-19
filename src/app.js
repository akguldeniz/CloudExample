"use strict"

const appPackage = require("../package.json")
const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const path = require("path")
const { error } = require("./__handlers")

const app = express()

// ... Config
app.use(bodyParser.json())

// ... Headers
app.use((req, res, next) => {
    res.set({
        "application-name": appPackage.name,
        "application-version": appPackage.version,
        "application-author": appPackage.author,
        "x-powered-by": "AnilKalender application server"
    })

    next()
})

// ... Ping
app.use("/ping", (req, res) => { res.send({ message: "Everything is perfect 🚀" }) })

// ... Define api route and import service
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())
for (const dir of dirs("./src"))
    if (dir[0] !== "_") {
        const dirController = require("./" + dir)
        if (dirController.controller.isRoot) {
            app.use("/", dirController.controller({ router: express.Router() }))
            console.log("Root controller -> /" + dir)
        }
        else {
            app.use("/" + dir, dirController.controller({ router: express.Router() }))
            console.log("Initialized controller -> /" + dir)
        }
    }

// ... Global error handler
app.use(error)

module.exports = app
