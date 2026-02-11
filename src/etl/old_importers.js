const fs = require('fs');
const csv = require('csv-parser');

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
    Photos,
} = require('../db/Models/index.js');

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
    cleanPhotos,
} = require('./transformers.js');

/**
 * Generic CSV importer
 * - Reads entire CSV
 * - Transforms rows
 * - Bulk inserts safely
 */
async function importCSV(filePath, Model, transform) {
    const records = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
            .on('data', (row) => {
                records.push(transform(row));
            })
            .on('end', async () => {
                try {
                    await Model.insertMany(records, { ordered: false });
                    console.log(`Inserted ${records.length} records into ${Model.collection.name}`);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', reject);
    });
}

module.exports = {
    importProducts: () => importCSV('data/Product/product.csv', Product, cleanProducts),
    importRelated: () => importCSV('data/Product/related.csv', Related, cleanRelated),
    importFeatures: () => importCSV('data/Product/features.csv', Features, cleanFeatures),
    importSKUs: () => importCSV('data/Product/skus.csv', SKUs, cleanSKUs),
    importStyles: () => importCSV('data/Product/styles.csv', Styles, cleanStyles),
    importQuestions: () => importCSV('data/QA/questions.csv', Questions, cleanQuestions),
    importAnswers: () => importCSV('data/QA/answers.csv', Answers, cleanAnswers),
    importAnswerPhotos: () => importCSV('data/QA/answers_photos.csv', AnswerPhotos, cleanAnswerPhotos),
    importReviews: () => importCSV('data/Reviews/reviews.csv', Reviews, cleanReviews),
    importReviewPhotos: () => importCSV('data/Reviews/reviews_photos.csv', ReviewPhotos, cleanReviewPhotos),
    importCharacteristics: () => importCSV('data/Reviews/characteristics.csv', Characteristics, cleanCharacteristics),
    importCharacteristicReviews: () => importCSV('data/Reviews/characteristic_reviews.csv', CharacteristicReviews, cleanCharacteristicReviews),
    importPhotos: () => importCSV('data/Product/photos.csv', Photos, cleanPhotos),
};
