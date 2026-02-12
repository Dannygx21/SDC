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
        MONGO_DBNAME,
    } = process.env;

    if (!MONGO_URL || !MONGO_DBNAME) {
        throw new Error('Missing required MongoDB environment variables: MONGO_URL, MONGO_DBNAME');
    }

    return `${MONGO_URL}`
}

async function connectToMongo(connectSuccessMsg, connectErrorMsg) {
    const {
        MONGO_USER,
        MONGO_PASS,
        MONGO_AUTH_SOURCE,
        MONGO_DBNAME,
        MONGO_URL
    } = process.env;

    const uri = buildMongoURI();

    const options = {
        user: MONGO_USER,
        pass: MONGO_PASS,
        authSource: MONGO_AUTH_SOURCE,
        dbName: MONGO_DBNAME
    };

    try {
        await mongoose.connect(uri, options);
        console.log('[MongoDB] Connected: ', uri);
        console.log(connectSuccessMsg || '');
    } catch (err) {
        console.error('[MongoDB] Connection error: ', err);
        console.log(connectErrorMsg || '');

        throw err;
    }
}

module.exports = {
    connectToMongo
};