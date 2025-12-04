// Server made to replicate Catwalk project. Catwalk project was given non-ideal API, forcing logic onto front end. This server serves as a replicate of that, to stand up catwalk application.
require('dotenv').config()
const mongoose = require('mongoose')

const { DB_URL, DB_NAME, DB_USER, DB_PASS } = process.env

//server
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.use(express.json())


//connect to mongodb
const db = mongoose.connect(DB_URL, {
    dbName: DB_NAME,
    user: DB_USER,
    pass: DB_PASS
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('mongodb connection error:', err))

app.get('/', async (req, res) => {
    console.log(`Request received: ${req.body}`)
    res.sendStatus(200)
})

app.get('/products', async (req, res) => {
    console.log(req.query.page)
    console.log(req.query.count)
    //Todo: route to mongoose schema to find count by page
    res.sendStatus(200)
})

app.listen(3000, () => {
    console.log('server listening on port 3000')
})