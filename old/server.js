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
const { ReviewsController } = require('../Schemas/Controllers/Reviews.mjs');
const { PhotosController } = require('../Schemas/Controllers/Photos.mjs');
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

// endpoint to get product by ID adds Features to the response
app.get('/products/:product_id', async (req, res) => {
    console.log('Received request for product ID:', req.params.product_id);
    ProductController.getProductById(Number(req.params.product_id))
        .then(async (product) => {
            const features = await FeaturesController.getFeaturesByProductId(Number(req.params.product_id));
            console.log('Features fetched for product ID:', req.params.product_id, features);
            res.status(200).send({ ...product.toObject(), features: features });
        })
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
        .then(items => {
            const arr = items.map(item => item.related_product_id)
            res.status(200).send(arr)
        })
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
            const results = await Promise.all(styles.map(async (style) => {
                const photos = await PhotosController.getPhotosByStyleId(style.style_id);
                const skus = await SKUsController.getSKUsByStylesId(style.style_id);
                const skusObj = skus.reduce((acc, sku) => {
                    acc[sku.id] = { quantity: sku.quantity, size: sku.size };
                    return acc;
                }, {});
                return { ...style.toObject(), photos: photos, skus: skusObj };
            }));
            res.status(200).send({ product_id: req.params.product_id, results: results });
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

app.get('/qa/questions', async (req, res) => {
    console.log('Received request for questions by product ID:', req.query.product_id, 'page:', req.query.page, 'count:', req.query.count);
    QuestionsController.getQuestionsByProductId(Number(req.query.product_id), Number(req.query.page), Number(req.query.count))
        .then((questions) => {
            res.status(200).send(questions)
        })
        .catch(err => {
            console.error('Error fetching questions by product ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.get('/reviews', async (req, res) => {
    console.log('Received request for reviews for product ID:', req.query.product_id, 'page:', req.query.page, 'count:', req.query.count, 'sort:', req.query.sort);
    ReviewsController.getReviewsByProductIdByPageCountAndSort(Number(req.query.product_id), Number(req.query.page), Number(req.query.count), req.query.sort)
        .then((reviews) => {
            res.status(200).send(reviews)
        })
        .catch(err => {
            console.error('Error fetching reviews by product ID in server:', err)
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