/**
 * Catwalk ETL entry point
 * ----------------------
 * - Connects to Mongo once
 * - Runs all CSV imports in sequence
 * - Exits cleanly (success or failure)
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import ETL CSV reader 
const { importCsv } = require('./importers.js');

// Import Mongoose models
const {
    Product,
    Related,
    Features,
    SKUs,
    Styles,
    Questions,
    Answers,
    AnswerPhotos,
    Reviews,
    ReviewPhotos,
    Characteristics,
    CharacteristicReviews,
    Photos
} = require('../db/Models/index.js');

// Import ETL transformers
const {
    cleanProducts,
    cleanRelated,
    cleanFeatures,
    cleanSKUs,
    cleanStyles,
    cleanQuestions,
    cleanAnswers,
    cleanAnswerPhotos,
    cleanReviews,
    cleanReviewPhotos,
    cleanCharacteristics,
    cleanCharacteristicReviews,
    cleanPhotos
} = require('./transformers.js');

// Mongo connection helper
const { connectToMongo } = require('../db/connect.js');

async function runETL() {
    try {
        console.log('Starting Catwalk ETL');

        await connectToMongo('ETL Connected to MongoDB', 'ETL Failed to Connect to MongoDB');

        // Run imports in a controlled order
        // await importCsv('data/Product/product.csv', Product, cleanProducts, 'Products');
        // await importCsv('data/Product/related.csv', Related, cleanRelated, 'Related');
        // await importCsv('data/Product/features.csv', Features, cleanFeatures, 'Features');
        // await importCsv('data/Product/styles.csv', Styles, cleanStyles, 'Styles');
        // await importCsv('data/Product/skus.csv', SKUs, cleanSKUs, 'SKUs');
        // await importCsv('data/Product/photos.csv', Photos, cleanPhotos, 'Photos');
        // await importCsv('data/QA/questions.csv', Questions, cleanQuestions, 'Questions');
        // await importCsv('data/QA/answers.csv', Answers, cleanAnswers, 'Answers');
        await importCsv('data/QA/answers_photos.csv', AnswerPhotos, cleanAnswerPhotos, 'Answer Photos');
        await importCsv('data/Reviews/reviews.csv', Reviews, cleanReviews, 'Reviews');
        await importCsv('data/Reviews/review_photos.csv', ReviewPhotos, cleanReviewPhotos, 'Review Photos');
        await importCsv('data/Reviews/characteristics.csv', Characteristics, cleanCharacteristics, 'Characteristics');
        await importCsv('data/Reviews/characteristic_reviews.csv', CharacteristicReviews, cleanCharacteristicReviews, 'Characteristic Reviews');

        console.log('ETL completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('ETL failed:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

runETL();
