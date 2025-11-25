require('dotenv').config()
const mongoose = require('mongoose');

const { DB_URL, DB_DBNAME, DB_USER, DB_PASS } = process.env

const { db_import } = require('../DB_IMPORT/main.js')

const path = require('path')
const dataPath = path.join(__dirname, '../Data')

// Server
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.use(express.json())


// Connect to MongoDB
const db = mongoose.connect(DB_URL, {
    dbName: DB_DBNAME,
    user: DB_USER,
    pass: DB_PASS
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.get('/', async (req, res) => {
    const results = await db_import.parseAndImport(path.resolve(dataPath, 'Product', 'Copy of skus.csv'), res)
    res.send(results)
})

app.listen(3000, () => {
    console.log('server listening on port 3000')
})