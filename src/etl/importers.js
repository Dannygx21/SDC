const fs = require('fs');
const csv = require('csv-parser');

const BATCH_SIZE = 5000;

async function importCsv(filePath, Model, transform, label) {
    return new Promise((resolve, reject) => {
        let buffer = [];
        let totalInserted = 0;

        const stream = fs.createReadStream(filePath)
            .pipe(csv({
                mapHeaders: ({ header }) => header.trim()
            }));

        const flushBuffer = async () => {
            if (buffer.length === 0) return;

            const batch = buffer;
            buffer = [];

            await Model.insertMany(
                batch, {
                ordered: true,
                rawResult: false
            });
            totalInserted += batch.length;

            console.log(`[${label}] Inserted ${totalInserted}`);
        };

        stream.on('data', (row) => {
            try {
                // For validation
                const transformed = transform(row);

                //Validate Immediately 
                const doc = new Model(transformed);
                const validationError = doc.validateSync();
                if (validationError) {
                    console.error(`\n[${label}] Validation Failed`)
                    console.error(validationError);
                    console.error('Offending document:', transformed);
                    process.exit(1);
                }

                buffer.push(transformed);

                if (buffer.length >= BATCH_SIZE) {
                    stream.pause();

                    flushBuffer()
                        .then(() => stream.resume())
                        .catch(reject);
                }
            } catch (err) {
                reject(err);
            }
        });

        stream.on('end', async () => {
            try {
                await flushBuffer();
                console.log(`[${label}] COMPLETE — ${totalInserted} total inserted`);
                resolve();
            } catch (err) {
                reject(err);
            }
        });

        stream.on('error', reject);
    });
}

module.exports = {
    importCsv
};