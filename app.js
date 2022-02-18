const express = require("express")
const cors = require("cors")
const moragn = require("morgan")
const nocache = require("nocache")
const bodyParser = require("body-parser")
const compression = require("compression")
const cluster = require("cluster")
const process = require("process")
const { cpus } = require("os")
const { isValidAppKey } = require("./api/middleware/api-key.middleware")
require("dotenv").config()

const numCPUs = cpus().length

if (cluster.isMaster) {
    console.log(`Primary ${process.pid} is running`)

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
    })
} else {
    const app = express()
    app.use(compression())
    app.use(cors())
    app.use(moragn("dev"))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(nocache())
    app.use(isValidAppKey) /* User API key middleware to globally */

    app.get('/', (req, res) => {
        res.send("WOW! Express app running. 😛😛😛")
    })

    app.get("/my-app-key", (req, res) => {
        res.status(200).json({
            api_key: req.api_key
        })
    })

    app.use((error, req, res, next) => {
        if (error.status == 404) {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error.status == 400) {
            return res.status(400).json({
                message: "Bad request."
            })
        }

        if (error.status == 401) {
            return res.status(401).json({
                message: "You have no permission."
            })
        }

        return res.status(500).json({
            message: "Something going wrong."
        })
    })

    // App Port
    const port = process.env.PORT || 4001
    app.listen(port, () => {
        console.log(`App running on ${port} port`)
    })
}