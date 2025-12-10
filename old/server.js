// Server made to replicate Catwalk project. Catwalk project was given non-ideal API, forcing logic onto front end. This server serves as a replicate of that, to stand up catwalk application.
require('dotenv').config()
const mongoose = require('mongoose')
const { ProductController } = require('../Schemas/Controllers/Products.mjs');
const { RelatedController } = require('../Schemas/Controllers/Related.mjs');
const { FeaturesController } = require('../Schemas/Controllers/Features.mjs');
const { SKUsController } = require('../Schemas/Controllers/SKUs.mjs');
const { StylesController } = require('../Schemas/Controllers/Styles.mjs');
const { DB_URL, DB_DBNAME, DB_USER, DB_PASS } = process.env

//server
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.use(express.json())


//connect to mongodb
const db = mongoose.connect(DB_URL, {
    dbName: DB_DBNAME,
    user: DB_USER,
    pass: DB_PASS
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('mongodb connection error:', err))

app.get('/', async (req, res) => {
    console.log(`Request received: ${req.body}`)
    res.sendStatus(200)
})

app.get('/products/:product_id', async (req, res) => {
    console.log('Received request for product ID:', req.params.product_id);
    ProductController.getProductById(Number(req.params.product_id))
        .then(product => res.status(200).send(product))
        .catch(err => {
            console.error('Error fetching product by ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.get('/products', async (req, res) => {
    console.log('Received request for products with page:', req.query.page, 'and count:', req.query.count);
    ProductController.getProductsByPageAndCount(req.query.page, req.query.count)
        .then(products => res.status(200).send(products))
        .catch(err => {
            console.error('Error fetching products by page and count in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.get('/products/:product_id/related', async (req, res) => {
    console.log('Received request for related items of product ID:', req.params.product_id);
    RelatedController.getRelatedByProductId(Number(req.params.product_id))
        .then(relatedItems => res.status(200).send(relatedItems))
        .catch(err => {
            console.error('Error fetching related items by product ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

// this endpoint returns styles and skus for a given product
// TODO : merge styles and skus into one response
app.get('/products/:product_id/styles', async (req, res) => {
    console.log('Received request for product styles of product ID:', req.params.product_id);
    const response = {}
    StylesController.getStylesByProductId(Number(req.params.product_id)).then(styles => {
        response.styles = styles;
    })
    const stylesArr = response.styl


    SKUsController.getSKUsByStylesId(Number())
        .then(product => res.status(200).send(product))
        .catch(err => {
            console.error('Error fetching product by ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

// Test ENDPOINT
app.get('/products/:product_id/styles/test', async (req, res) => {
    console.log('TEST Received request for styles by ID:', req.params.product_id);
    StylesController.getStylesByProductId(Number(req.params.product_id))
        .then(product => res.status(200).send(product))
        .catch(err => {
            console.error('Error fetching product by ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.listen(3000, () => {
    console.log('server listening on port 3000')
})