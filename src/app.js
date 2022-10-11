import express from 'express'
import connection from './database/db.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const server = express()
server.use(cors())
server.use(express.json())



server.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT)
})

