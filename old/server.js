// Server made to replicate Catwalk project. Catwalk project was given non-ideal API, forcing logic onto front end. This server serves as a replicate of that, to stand up catwalk application.
require('dotenv').config()
const mongoose = require('mongoose')
const { ProductController } = require('../Schemas/Controllers/Products.mjs');
const { RelatedController } = require('../Schemas/Controllers/Related.mjs');
const { FeaturesController } = require('../Schemas/Controllers/Features.mjs');
const { SKUsController } = require('../Schemas/Controllers/SKUs.mjs');
const { StylesController } = require('../Schemas/Controllers/Styles.mjs');
const { AnswersController } = require('../Schemas/Controllers/Answers.mjs');
const { AnswerPhotosController } = require('../Schemas/Controllers/AnswerPhotos.mjs');
const { QuestionsController } = require('../Schemas/Controllers/Questions.mjs');
const { DB_URL, DB_DBNAME, DB_USER, DB_PASS } = process.env

//server
const cors = require('cors')
const express = require('express');
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
    console.log('Received request for styles by ID:', req.params.product_id);
    StylesController.getStylesByProductId(Number(req.params.product_id))
        .then(async (styles) => {
            // for each style, get the skus
            const stylesWithSkus = await Promise.all(styles.map(async (style) => {
                const skus = await SKUsController.getSKUsByStylesId(style.style_id);
                return { ...style.toObject(), skus: skus };
            }));
            res.status(200).send({ product_id: req.params.product_id, results: stylesWithSkus });
        })
        .catch(err => {
            console.error('Error fetching product by ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })

})

// endpoint to get answers by question ID, as well as associated answer photos (merged)
app.get('/qa/questions/:question_id/answers', async (req, res) => {
    console.log('Received request for answers by question ID:', req.params.question_id);
    AnswersController.getAnswersByQuestionId(Number(req.params.question_id))
        .then(async (answers) => {
            //for each answer, get the photos
            const answersWithPhotos = await Promise.all(answers.map(async (answer) => {
                const photos = await AnswerPhotosController.getAnswerPhotosByAnswerId(answer.id);
                return { ...answer.toObject(), photos: photos };
            }));

            res.status(200).send(answersWithPhotos);
        })

        .catch(err => {
            console.error('Error fetching answers by question ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.get('/qa/questions/:product_id/:count/:page', async (req, res) => {
    console.log('Received request for questions by product ID:', req.params.product_id, 'page:', req.params.page, 'count:', req.params.count);
    QuestionsController.getQuestionsByProductId(Number(req.params.product_id), Number(req.params.page), Number(req.params.count))
        .then(questions => res.status(200).send(questions))
        .catch(err => {
            console.error('Error fetching questions by product ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

// Test ENDPOINT
app.get('/products/:product_id/styles/test', async (req, res) => {
    console.log('TEST Received request for styles by ID:', req.params.product_id);
    StylesController.getStylesByProductId(Number(req.params.product_id))
        .then(product =>
            console.log('TEST styles fetched:', product[0]._id, typeof product[0]._id) ||
            res.status(200).send(product))
        .catch(err => {
            console.error('Error fetching product by ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.listen(3000, () => {
    console.log('server listening on port 3000')
})