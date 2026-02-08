/**
 * MongoDB connection helper
 * -------------------------
 * Centralized Mongo connection logic.
 * Used by:
 * - API server
 * - ETL
 * - Tests
 */

const mongoose = require('mongoose');

function buildMongoURI() {
    const {
        MONGO_HOST,
        MONGO_PORT,
        MONGO_DB,
    } = process.env;

    if (!MONGO_HOST || !MONGO_DB) {
        throw new Error('Missing required MongoDB environment variables: MONGO_HOST, MONGO_DB');
    }

    // Atlas SRV vs Standard Mongo
    if (MONGO_HOST.includes('mongodb.net')) {
        return `mongodb+srv://${MONGO_HOST}/${MONGO_DB}`;
    }

    return `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
}

async function connectToMongo() {
    const {
        MONGO_USER,
        MONGO_PASS,
        MONGO_AUTH_SOURCE
    } = process.env;

    const uri = buildMongoURI();

    const options = {
        user: MONGO_USER,
        pass: MONGO_PASS
    };

    if (MONGO_AUTH_SOURCE) {
        options.authSource = MONGO_AUTH_SOURCE;
    }

    try {
        await mongoose.connect(uri, options);
        console.log('[MongoDB] Connected: ', uri);
    } catch (err) {
        console.error('[MongoDB] Connection error: ', err);
        throw err;
    }
}

module.exports = {
    connectToMongo
};