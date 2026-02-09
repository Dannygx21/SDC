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
        MONGO_URL,
        MONGO_PORT,
        MONGO_DBNAME,
    } = process.env;

    if (!MONGO_URL || !MONGO_DBNAME) {
        throw new Error('Missing required MongoDB environment variables: MONGO_URL, MONGO_DBNAME');
    }

    return `${MONGO_URL}`
}

async function connectToMongo() {
    const {
        MONGO_USER,
        MONGO_PASS,
    } = process.env;

    const uri = buildMongoURI();

    const options = {
        user: MONGO_USER,
        pass: MONGO_PASS
    };

    if (MONGO_AUTH_SOURCE) {
        options.authSource = MONGO_DBNAME;
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