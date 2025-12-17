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
const { ReviewPhotosController } = require('../Schemas/Controllers/ReviewPhotos.mjs');
const { CharacteristicsController } = require('../Schemas/Controllers/Characteristics.mjs');
const { CharacteristicReviewsController } = require('../Schemas/Controllers/CharacteristicReviews.mjs');
const { DB_URL, DB_DBNAME, DB_USER, DB_PASS } = process.env

//server
const cors = require('cors')
const express = require('express');
const ReviewPhotos = require('../Schemas/Models/ReviewPhotos');
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
            if (!!product) {
                const features = await FeaturesController.getFeaturesByProductId(Number(req.params.product_id));
                res.status(200).send({ ...product.toObject(), features: features });
            } else {
                // handle product ID not found

            }
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
                if (!photos || photos.length === 0) {
                    console.log('No photos found for style ID:', style.style_id);
                    photos.push({ thumbnail_url: 'https://unsplash.com/photos/white-egg-with-face-illustration-WtolM5hsj14', url: 'https://unsplash.com/photos/white-egg-with-face-illustration-WtolM5hsj14' });
                }
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
    console.log('Received request for answers by question ID:', req.params.question_id)
    console.log('this was called')
    AnswersController.getAnswersByQuestionId(Number(req.params.question_id))
        .then(async (answers) => {
            // for each answer, get the photos
            const answersWithPhotos = await Promise.all(answers.map(async (answer) => {
                const photos = await AnswerPhotosController.getAnswerPhotosByAnswerId(answer.answer_id);
                return { ...answer.toObject(), photos: photos };
            }));
            res.status(200).send({ question: req.params.question_id, page: 1, count: answersWithPhotos.length, results: answersWithPhotos });
        })
        .catch(err => {
            console.error('Error fetching answers by question ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.get('/qa/questions', async (req, res) => {
    console.log('Received request for questions for product ID:', req.query.product_id, 'page:', req.query.page, 'count:', req.query.count);
    QuestionsController.getQuestionsByProductId(Number(req.query.product_id), Number(req.query.page), Number(req.query.count))
        .then(questions => {
            // for each question, get the answers
            Promise.all(questions.map(async (question) => {
                const answers = await AnswersController.getAnswersByQuestionId(question.question_id);
                // for each answer, get the photos
                const answersWithPhotos = await Promise.all(answers.map(async (answer) => {
                    const photos = await AnswerPhotosController.getAnswerPhotosByAnswerId(answer.id);
                    return { ...answer.toObject(), photos: photos };
                }));
                return { ...question.toObject(), answers: answersWithPhotos };
            }))
                .then(questionsWithAnswers => {
                    // format answers as an object with answer_id as key
                    const formattedQuestions = questionsWithAnswers.map(question => {
                        const answersObj = {};
                        question.answers.forEach(answer => {
                            answersObj[answer.id] = answer;
                        });
                        return { ...question, answers: answersObj };
                    });
                    res.status(200).send({ product_id: req.query.product_id, results: formattedQuestions });
                })
                .catch(err => {
                    console.error('Error fetching answers for questions in server:', err)
                    res.status(500).json({ error: 'Internal Server Error' })
                })
        })
        .catch(err => {
            console.error('Error fetching questions by product ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

// endpoint to post a new question
app.post('/qa/questions', async (req, res) => {
    console.log('Received request to post new question with data:', req.body);
    const questionData = {
        product_id: req.body.product_id,
        body: req.body.body,
        date: new Date().toISOString(),
        asker_name: req.body.asker_name,
        asker_email: req.body.asker_email,
        reported: false,
        helpfulness: 0
    };
    QuestionsController.postQuestion(questionData)
        .then(newQuestion => {
            res.status(201).send();
        })
        .catch(err => {
            console.error('Error posting new question in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
});

// endpoint to post a new answer
app.post('/qa/questions/:question_id/answers', async (req, res) => {
    console.log('Received request to post new answer for question ID:', req.params.question_id, 'with data:', req.body);
    const answerData = {
        question_id: Number(req.params.question_id),
        body: req.body.body,
        date: new Date().toISOString(),
        answerer_name: req.body.answerer_name,
        answerer_email: req.body.answerer_email,
        reported: false,
        helpfulness: 0
    };
    AnswersController.postAnswer(answerData)
        .then(async (newAnswer) => {
            // handle photos
            if (req.body.photos && req.body.photos.length > 0) {
                await Promise.all(req.body.photos.map(async (url) => {
                    const newPhoto = await AnswerPhotosController.addAnswerPhoto(newAnswer.answer_id, url);
                    return newPhoto;
                }));
            }
            res.status(201).send();
        })
        .catch(err => {
            console.error('Error posting new answer in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
});

app.put('/qa/questions/:question_id/helpful', async (req, res) => {
    console.log('Received request to mark question as helpful, question ID:', req.params.question_id);
    QuestionsController.markQuestionAsHelpful(Number(req.params.question_id))
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => {
            console.error('Error marking question as helpful in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.put('/qa/questions/:question_id/report', async (req, res) => {
    console.log('Received request to report question, question ID:', req.params.question_id);
    QuestionsController.reportQuestion(Number(req.params.question_id))
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => {
            console.error('Error reporting question in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.put('/qa/answers/:answer_id/helpful', async (req, res) => {
    console.log('Received request to mark answer as helpful, answer ID:', req.params.answer_id);
    AnswersController.markAnswerAsHelpful(Number(req.params.answer_id))
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => {
            console.error('Error marking answer as helpful in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.put('/qa/answers/:answer_id/report', async (req, res) => {
    console.log('Received request to report answer, answer ID:', req.params.answer_id);
    AnswersController.reportAnswer(Number(req.params.answer_id))
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => {
            console.error('Error reporting answer in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.get('/reviews', async (req, res) => {
    console.log('Received request for reviews for product ID:', req.query.product_id, 'page:', req.query.page, 'count:', req.query.count, 'sort:', req.query.sort);
    ReviewsController.getReviewsByProductIdByPageCountAndSort(Number(req.query.product_id), Number(req.query.page), Number(req.query.count), req.query.sort)
        .then(async (reviews) => {
            const reviewPhotos = await Promise.all(reviews.map(async (review) => {
                const photos = await ReviewPhotosController.getReviewPhotosByReviewId(review.review_id);
                return { ...review.toObject(), photos: photos };
            }));
            res.status(200).send({ product_id: req.query.product_id, results: reviewPhotos });
        })
        .catch(err => {
            console.error('Error fetching reviews by product ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.get('/reviews/meta', async (req, res) => {
    console.log('Received request for review metadata for product ID:', req.query.product_id);
    const response = {}
    Promise.all([
        ReviewsController.getReviewsByProductIdByPageCountAndSort(Number(req.query.product_id), 1, 1000, 'newest'),
        CharacteristicsController.getCharacteristicsByProductId(Number(req.query.product_id))
    ])
        .then(async ([reviews, characteristics]) => {
            //ratings and recommended
            const ratings = {};
            const recommended = { false: 0, true: 0 };
            reviews.forEach(review => {
                ratings[review.rating] = (ratings[review.rating] || 0) + 1;
                recommended[review.recommend] += 1;
            });
            response.product_id = req.query.product_id;
            response.ratings = ratings;
            response.recommended = recommended;
            //characteristics
            const characteristicsObj = {};
            await Promise.all(characteristics.map(async (characteristic) => {
                const charReviews = await CharacteristicReviewsController.getCharacteristicReviewsByCharacteristicId(characteristic.id);
                const total = charReviews.reduce((sum, cr) => sum + cr.value, 0);
                let average;
                if (charReviews.length > 0) {
                    average = total / charReviews.length;
                } else {
                    average = 0;
                }
                characteristicsObj[characteristic.name] = {
                    id: characteristic.id,
                    value: average.toFixed(4)
                };
            }));
            response.characteristics = characteristicsObj;
            console.log('Review metadata response for product ID:', req.query.product_id, response);
            res.status(200).send(response);
        })
        .catch(err => {
            console.error('Error fetching review metadata by product ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.get('/characteristics/:product_id', async (req, res) => {
    console.log('Received request for characteristics for product ID:', req.params.product_id);
    CharacteristicsController.getCharacteristicsByProductId(Number(req.params.product_id))
        .then((characteristics) => {
            res.status(200).send(characteristics);
        })
        .catch(err => {
            console.error('Error fetching characteristics by product ID in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.post('/reviews', async (req, res) => {
    console.log('Received request to post new review with data:', req.body);
    const { photos, characteristics, ...reviewData } = req.body;
    reviewData.date = new Date().toISOString();
    reviewData.reported = false;
    reviewData.helpfulness = 0;
    ReviewsController.postReview(reviewData)
        .then(async (newReview) => {
            //handle photos
            if (photos && photos.length > 0) {
                await Promise.all(photos.map(async (url) => {
                    const newPhoto = await ReviewPhotosController.addReviewPhoto(newReview.review_id, url);
                    return newPhoto;
                }));
            }
            //handle characteristic reviews
            if (characteristics) {
                await Promise.all(Object.entries(characteristics).map(async ([characteristicId, value]) => {
                    const newCharReview = await CharacteristicReviewsController.addCharacteristicReview(Number(characteristicId), newReview.review_id, value);
                    return newCharReview;
                }));
            }
            res.status(201).send(newReview);
        })
        .catch(err => {
            console.error('Error posting new review in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })

});

app.put('/reviews/:review_id/helpful', async (req, res) => {
    console.log('Received request to mark review as helpful, review ID:', req.params.review_id);
    ReviewsController.markReviewAsHelpful(Number(req.params.review_id))
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => {
            console.error('Error marking review as helpful in server:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        })
})

app.put('/reviews/:review_id/report', async (req, res) => {
    console.log('Received request to report review, review ID:', req.params.review_id);
    ReviewsController.reportReview(Number(req.params.review_id))
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => {
            console.error('Error reporting review in server:', err)
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