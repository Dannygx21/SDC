const mongoose = require('mongoose');

const { AnswerPhotos,
    Answers,
    CharacteristicReviews,
    Characteristics,
    Features,
    Photos,
    Product,
    Questions,
    Related,
    ReviewPhotos,
    Reviews,
    SKUs,
    Styles
} = require('../Schemas/Models/index.js')

require('dotenv').config({ path: '../.env' });
const { DB_URL2, DB_USER, DB_PASS, DB_URL } = process.env

console.log('DB_URL in ETL:', DB_URL);

const fs = require('fs');
const csv = require('csv-parser'); // You might need to install 'csv-parser' package: npm install csv-parser
const { type } = require('os');


const ETL = {
    connectToDB: async (dbName, collectionName, URL) => {
        await mongoose.connect(URL, {
            user: DB_USER,
            pass: DB_PASS,
            dbName: dbName
        }).then(() => console.log(`MongoDB connected to ${collectionName} collection`))
            .catch(err => console.log('mongodb connection error:', err));
    },


    // mainImort: function to import csv programmatically
    // Parameters: 
    // - dbName (string: db name to be used)
    // - collectionName (string: collection or table name)
    // - csvFilePath (string: filepath to csv to be read)
    // - mongoUrl (string: database url)
    // - mongoose_model (object: used to access mongoose insertmany method)
    // - action (function: used to transform csv data object to desired database format object. ETL.noChange is a method to make no changes to the CSV data object)
    // - test (boolean: if true, the mainImport will console log the changes without inserting any files to database. if false, files will be inserted )
    mainImport: async (dbName, collectionName, csvFilePath, mongoUrl, mongoose_model, action, test) => {
        // double check of what is being passed into function
        console.log('URL: ', mongoUrl)
        console.log('Database Name: ', dbName)
        console.log('collection Name: ', collectionName)
        console.log('file path: ', csvFilePath)

        //connect to mongoDB
        await ETL.connectToDB(dbName, collectionName, mongoUrl);

        //only allowing a certain number of records
        let count = 0
        try {
            fs.createReadStream(csvFilePath)
                .on('error', (err) => console.log('error :', err))
                // remove leading/trailing spaces from headers
                .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
                .on('data', async (data) => {
                    // if not a test, insert records being read
                    if (count <= 500 && !test) {
                        mongoose_model.insertMany(action(data)).then(() => {
                            console.log('Inserted record');
                        }).catch(err => {
                            console.error(`Error inserting record`, err);
                        });
                        //increase count for every record read
                        count++
                        // if a test, read records only 
                    } else if (count <= 30 && test) {
                        console.log('Data row: ', data)
                        console.log('Transformed Data row: ', action(data))
                        //increase count for every record read
                        count++
                    }
                })
                // closing database connection and cleaning up count
                .on('end', async () => {
                    console.log('Operation ended with: ', count)
                    count = null
                    mongoose.connection.close()
                });
        } catch (error) {
            console.error(`Error during programmatic import: ${error.message}`);
        }
    },

    noChange: function (data) {
        return data;
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

    cleanRelated: function (data) {
        return {
            id: Number(data.id),
            current_product_id: Number(data.current_product_id),
            related_product_id: Number(data.related_product_id)
        };
    },

    cleanFeatures: function (data) {
        if (data.feature === 'null') {
            data.feature = undefined;
        }
        return {
            id: Number(data.id),
            product_id: Number(data.product_id),
            feature: data.feature,
            value: data.value
        };
    },

    cleanSKUs: function (data) {
        return {
            id: Number(data.id),
            style_id: Number(data.styleId),
            size: data.size,
            quantity: Number(data.quantity)
        };
    },

    cleanStyles: function (data) {
        if (data.sale_price === 'null') {
            data.sale_price = undefined;
        }
        return {
            style_id: Number(data.id),
            product_id: Number(data.productId),
            name: data.name,
            sale_price: data.sale_price,
            original_price: Number(data.original_price),
            default_style: data.default_style === '1' ? true : false
        };
    },

    cleanAnswers: function (data) {
        return {
            answer_id: Number(data.id),
            question_id: Number(data.question_id),
            body: data.body,
            date: data.date_written,
            answerer_name: data.answerer_name,
            answerer_email: data.answerer_email,
            reported: data.reported === '1' ? true : false,
            helpfulness: Number(data.helpful),
        };
    },


    cleanAnswerPhotos: function (data) {
        return {
            id: Number(data.id),
            answer_id: Number(data.answer_id),
            url: data.url,
        };
    },

    cleanQuestions: function (data) {
        return {
            question_id: Number(data.id),
            product_id: Number(data.product_id),
            question_body: data.body,
            question_date: data.date_written,
            asker_name: data.asker_name,
            asker_email: data.asker_email,
            reported: data.reported === '1' ? true : false,
            question_helpfulness: Number(data.helpful),
        };
    },

    cleanCharacteristics: function (data) {
        return {
            id: Number(data.id),
            product_id: Number(data.product_id),
            name: data.name,
        };
    },

    cleanCharacteristicReviews: function (data) {
        return {
            id: Number(data.id),
            characteristic_id: Number(data.characteristic_id),
            review_id: Number(data.review_id),
            value: Number(data.value),
        };
    },

    cleanReviewPhotos: function (data) {
        return {
            id: Number(data.id),
            review_id: Number(data.review_id),
            url: data.url,
        };
    },

    cleanReviews: function (data) {
        return {
            review_id: Number(data.id),
            product_id: Number(data.product_id),
            rating: Number(data.rating),
            date: data.date,
            summary: data.summary,
            body: data.body,
            recommend: data.recommend === '1' ? true : false,
            reported: data.reported === '1' ? true : false,
            reviewer_name: data.reviewer_name,
            reviewer_email: data.reviewer_email,
            response: data.response === 'null' ? undefined : data.response,
            helpfulness: Number(data.helpfulness),
        };
    },

    cleanPhotos: function (data) {
        return {
            id: Number(data.id),
            styleId: Number(data.styleId),
            url: data.url,
            thumbnail_url: data.thumbnail_url
        };
    },

    importProductsToOldDB: function async() {
        this.mainImport('Catwalk-old', 'Product', '../Data/Product/Copy of product.csv', DB_URL, Product, this.cleanProducts);
    },

    importRelatedToOldDB: function () {
        this.mainImport('Catwalk-old', 'Related', '../Data/Product/Copy of related.csv', DB_URL, Related, this.cleanRelated);
    },

    importFeaturesToOldDB: function () {
        this.mainImport('Catwalk-old', 'Features', '../Data/Product/Copy of features.csv', DB_URL, Features, this.cleanFeatures);
    },

    importSKUsToOldDB: function () {
        this.mainImport('Catwalk-old', 'SKUs', '../Data/Product/Copy of skus.csv', DB_URL, SKUs, this.cleanSKUs);
    },

    importStylesToOldDB: function () {
        this.mainImport('Catwalk-old', 'Styles', '../Data/Product/Copy of styles.csv', DB_URL, Styles, this.cleanStyles);
    },

    importAnswersToOldDB: function () {
        this.mainImport('Catwalk-old', 'Answers', '../Data/QA/answers.csv', DB_URL, Answers, this.cleanAnswers);
    },

    importAnswerPhotosToOldDB: function () {
        this.mainImport('Catwalk-old', 'AnswerPhotos', '../Data/QA/answers_photos.csv', DB_URL, AnswerPhotos, this.cleanAnswerPhotos);
    },

    importQuestionsToOldDB: function () {
        this.mainImport('Catwalk-old', 'Questions', '../Data/QA/questions.csv', DB_URL, Questions, this.cleanQuestions);
    },

    importCharacteristicsToOldDB: function () {
        this.mainImport('Catwalk-old', 'Characteristics', '../Data/Reviews/characteristics.csv', DB_URL, Characteristics, this.cleanCharacteristics);
    },

    importCharacteristicReviewsToOldDB: function () {
        this.mainImport('Catwalk-old', 'CharacteristicReviews', '../Data/Reviews/characteristic_reviews.csv', DB_URL, CharacteristicReviews, this.cleanCharacteristicReviews);
    },

    importReviewPhotosToOldDB: function () {
        this.mainImport('Catwalk-old', 'ReviewPhotos', '../Data/Reviews/reviews_photos.csv', DB_URL, ReviewPhotos, this.cleanReviewPhotos);
    },

    importReviewsToOldDB: function () {
        this.mainImport('Catwalk-old', 'Reviews', '../Data/Reviews/reviews.csv', DB_URL, Reviews, this.cleanReviews);
    },

    importPhotosToOldDB: function () {
        this.mainImport('Catwalk-old', 'Photos', '../Data/Product/Copy of photos.csv', DB_URL, Photos, this.cleanPhotos, true);
    }


}



ETL.importPhotosToOldDB();


// Example usage:
// importCsvProgrammatically('Catwalk-old', 'Related', '../Data/Product/Copy of related.csv', DB_URL);
// importCsvProgrammatically('Catwalk-old', 'Product', '../Data/Product/Copy of product.csv', DB_URL);
// importCsvProgrammatically('Catwalk-old', 'Features', '../SDC/Data/Product/Copy of features.csv', DB_URL2);
// importCsvProgrammatically('Catwalk-old', 'SKUs', '../SDC/Data/Product/Copy of skus.csv', DB_URL2);
// importCsvProgrammatically('Catwalk-old', 'Styles', '../SDC/Data/Product/Copy of styles.csv', DB_URL2);