/**
 * Catwalk ETL entry point
 * ----------------------
 * - Connects to Mongo once
 * - Runs all CSV imports in sequence
 * - Exits cleanly (success or failure)
 */

const mongoose = require('mongoose');
require('dotenv').config();
const { MONGO_URL, MONGO_DBNAME, MONGO_USER, MONGO_PASS, MONGO_AUTH_SOURCE } = process.env;

const {
    importProducts,
    importRelated,
    importFeatures,
    importSKUs,
    importStyles,
    importQuestions,
    importAnswers,
    importAnswerPhotos,
    importReviews,
    importReviewPhotos,
    importCharacteristics,
    importCharacteristicReviews,
    importPhotos,
} = require('./importers');

async function runETL() {
    try {
        console.log('Starting Catwalk ETL');

        await mongoose.connect(MONGO_URL, {
            dbName: MONGO_DBNAME,
            authSource: MONGO_AUTH_SOURCE,
            user: MONGO_USER,
            pass: MONGO_PASS,
        });

        console.log('MongoDB connected');

        // Run imports in a controlled order
        await importProducts();
        await importRelated();
        await importFeatures();
        await importSKUs();
        await importStyles();
        await importQuestions();
        await importAnswers();
        await importAnswerPhotos();
        await importReviews();
        await importReviewPhotos();
        await importCharacteristics();
        await importCharacteristicReviews();
        await importPhotos();

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
