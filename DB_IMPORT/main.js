const read = require('csvtojson');

const CSV = {

    //read and parse CSV, then insert into MongoDB
    parseAndImport: async function (csvPath) {
        read().fromFile(csvPath).subscribe((jsonArrayObj) => {
            //jsonArrayObj is an array of JSON Objects, one for each row of CSV
            console.log('Parsed CSV data:', jsonArrayObj)

            //insert the data into MongoDB
            //TODO: Import to DB
            // Example:
            // User.insertMany(jsonArrayObj)
            //     .then(() => console.log('Data successfully imported into MongoDB'))
            //     .catch(err => console.error('Error importing data:', err))
            //     .finally(() => mongoose.connection.close()); // Close connection after import
            return new Promise((resolve, reject) => {
                resolve(jsonArrayObj)
            })
        })
        // .catch(err => console.error('Error parsing CSV:', err));
    },

    //
    parse: async function (path, callback) {
        read().fromFile(path).subscribe((lineObject) => {
            callback(lineObject)
        })
    }
}


module.exports = {
    db_import
}