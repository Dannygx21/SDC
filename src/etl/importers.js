const fs = require('fs');
const csv = require('csv-parser');

const BATCH_SIZE = 5000;

async function importCsv({
    filePath,
    Model,
    transform,
    label
}) {
    return new Promise((resolve, reject) => {
        let buffer = [];
        let totalInserted = 0;
        let streamPaused = false;

        const stream = fs.createReadStream(filePath)
            .pipe(csv());

        stream.on('data', async (row) => {
            try {
                const transformed = transform(row);
                buffer.push(transformed);

                if (buffer.length >= BATCH_SIZE && !streamPaused) {
                    stream.pause();
                    streamPaused = true;

                    await Model.insertMany(buffer, { ordered: false });

                    totalInserted += buffer.length;
                    console.log(`[${label}] Inserted ${totalInserted} records`);

                    buffer = [];
                    streamPaused = false;
                    stream.resume();
                }
            } catch (err) {
                console.error(`[${label}] Error processing row`, err);
            }
        });

        stream.on('end', async () => {
            try {
                if (buffer.length > 0) {
                    await Model.insertMany(buffer, { ordered: false });
                    totalInserted += buffer.length;
                }

                console.log(`[${label}] COMPLETE — ${totalInserted} total inserted`);
                resolve();
            } catch (err) {
                reject(err);
            }
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = {
    importCsv
};
