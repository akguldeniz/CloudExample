"use strict"

// ... Env file config
require("dotenv").config()
const appPackage = require("./package.json")

const app = require("./src/app")

app.listen(process.env.PORT, () => {
    console.log("\n\nServer is running on port: %d 🚀", process.env.PORT)
})
