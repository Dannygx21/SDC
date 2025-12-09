const mongoose = require('mongoose');
const Product = require('../Schemas/Models/Products.js')

require('dotenv').config({ path: '../.env' });
const { DB_URL2, DB_USER, DB_PASS, DB_URL } = process.env

console.log('DB_URL in ETL:', DB_URL);

const fs = require('fs');
const csv = require('csv-parser'); // You might need to install 'csv-parser' package: npm install csv-parser


const ETL = {
    // main function to import csv programmatically
    // action is a function to clean data before inserting into DB
    // mongoose_model is the model to insert data into

    mainImport: async (dbName, collectionName, csvFilePath, mongoUrl, mongoose_model, action) => {
        console.log('URL: ', mongoUrl)
        console.log('Database Name: ', dbName)
        console.log('collection Name: ', collectionName)
        console.log('file path: ', csvFilePath)

        //connect to mongoDB
        mongoose.connect(mongoUrl, {
            user: DB_USER,
            pass: DB_PASS,
            dbName: dbName
        }).then(() => console.log('MongoDB connected for CSV import'))
            .catch(err => console.log('mongodb connection error for CSV import:', err));

        //only allowing a certain number of records
        let count = 0
        try {
            fs.createReadStream(csvFilePath)
                .on('error', (err) => console.log('error :', err))
                // remove leading/trailing spaces from headers
                .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
                .on('data', async (data) => {
                    if (count <= 500) {
                        mongoose_model.insertMany(action(data)).then(() => {
                            console.log('Inserted record');
                        }).catch(err => {
                            console.error(`Error inserting record`);
                        });
                        count++
                    }
                })
                .on('end', async () => {
                    console.log('Operation ended with: ', count)
                    count = null
                });
        } catch (error) {
            console.error(`Error during programmatic import: ${error.message}`);
        }
    },

    cleanProducts: function (data) {
        return {
            id: Number(data.id),
            name: data.name,
            slogan: data.slogan,
            description: data.description,
            category: data.category,
            default_price: Number(data.default_price)
        };
    },

    importProductsToOldDB: function async() {
        this.mainImport('Catwalk-old', 'Product', '../Data/Product/Copy of product.csv', DB_URL, Product, this.cleanProducts);
    },

    importRelated: async () => {
        await mainImport('Catwalk-old', 'Related', '../Data/Product/Copy of related.csv', DB_URL);
    }
}



ETL.importProductsToOldDB();


// Example usage:
// importCsvProgrammatically('Catwalk-old', 'Related', '../Data/Product/Copy of related.csv', DB_URL);
// importCsvProgrammatically('Catwalk-old', 'Product', '../Data/Product/Copy of product.csv', DB_URL);
// importCsvProgrammatically('Catwalk-old', 'Features', '../SDC/Data/Product/Copy of features.csv', DB_URL2);
// importCsvProgrammatically('Catwalk-old', 'SKUs', '../SDC/Data/Product/Copy of skus.csv', DB_URL2);
// importCsvProgrammatically('Catwalk-old', 'Styles', '../SDC/Data/Product/Copy of styles.csv', DB_URL2);