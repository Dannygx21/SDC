const path = require('path')
const dataPath = path.join(__dirname, '../Data')

require('dotenv').config()
const { DB_URL2, DB_USER, DB_PASS } = process.env

const fs = require('fs');
const csv = require('csv-parser'); // You might need to install 'csv-parser' package: npm install csv-parser
const { MongoClient } = require('mongodb'); // Assuming you're using the native MongoDB driver

async function importCsvProgrammatically(dbName, collectionName, csvFilePath, mongoUrl = DB_URL2) {
    console.log('URL: ', DB_URL2)
    console.log('Database Name: ', dbName)
    console.log('collection Name: ', collectionName)
    console.log('file path: ', csvFilePath)
    const client = new MongoClient(mongoUrl);
    let count = 0
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        fs.createReadStream(csvFilePath)
            .on('error', (err) => console.log('error :', err))
            .pipe(csv())
            .on('data', async (data) => {
                if (count <= 1000) {

                    await collection.insertOne(data)
                    count++
                }
            })
            .on('end', async () => {
                // if (records.length > 0) {
                // await collection.insertMany(records);
                // console.log(`${records.length} records imported successfully.`);
                // } else {
                // console.log('No records found in CSV to import.');
                // }
                console.log('Operation ended')
                count = 0
                await client.close();
            });
    } catch (error) {
        console.error(`Error during programmatic import: ${error.message}`);
    }
}

// Example usage:
importCsvProgrammatically('Catwalk-old', 'Related', '../SDC/Data/Product/Copy of related.csv', DB_URL2);
importCsvProgrammatically('Catwalk-old', 'Product', '../SDC/Data/Product/Copy of product.csv', DB_URL2);
importCsvProgrammatically('Catwalk-old', 'Features', '../SDC/Data/Product/Copy of features.csv', DB_URL2);
importCsvProgrammatically('Catwalk-old', 'SKUs', '../SDC/Data/Product/Copy of skus.csv', DB_URL2);
importCsvProgrammatically('Catwalk-old', 'Styles', '../SDC/Data/Product/Copy of styles.csv', DB_URL2);