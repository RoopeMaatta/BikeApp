const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require("../db");
const stream = require('stream');
const Sequelize = require('sequelize');

const dataFolder = path.join(__dirname, '..', 'data');
const BATCH_SIZE = 50;

const importData = async () => {
  const logStream = fs.createWriteStream(path.join(__dirname, 'unimportedTrips.log'), { flags: 'a' });

  // Get all bike station IDs for foreign key check
  const bikeStationRecords = await db.models.Bikestation.findAll({ attributes: ['ID'] });
  const bikeStationIds = bikeStationRecords.map(station => station.ID);
  


  const seenRows = new Set();  // Keep track of seen rows for checking duplicate entries

  const isCoveredDistanceOrDurationTooSmall = (row) => {
    const coveredDistanceMeters = parseInt(row.coveredDistanceMeters);
    const durationSeconds = parseInt(row.durationSeconds);
    return coveredDistanceMeters <= 10 || durationSeconds <= 10;
  };

  const isDuplicateFields = (row) => {
    const rowString = JSON.stringify(row);
    if (seenRows.has(rowString)) {
      return true;
    } else {
      seenRows.add(rowString);
      return false;
    }
  };

  const isForeignKeyInvalid = (row) => {
    return !bikeStationIds.includes(row.departureStationId) || !bikeStationIds.includes(row.returnStationId);
  };

  try {
    const csvFiles = fs.readdirSync(dataFolder).filter(file => file.endsWith('.csv'));
    for (const file of csvFiles) {
      if (file === 'bikeStations.csv' || file === "testTrips.csv" || file === "testTrips2.csv" || file === "2021-05xxx.csv") {
        console.log(`Skipping file: ${file}`);
        continue;
      }

      const filePath = path.join(dataFolder, file);

      await new Promise((resolve, reject) => {
        let isInitialChunk = true;
        let rowsBatch = [];

        const removeBomTransform = new stream.Transform({
          transform(chunk, encoding, callback) {
            if (isInitialChunk) {
              if (chunk[0] === 0xEF && chunk[1] === 0xBB && chunk[2] === 0xBF) {
                chunk = chunk.slice(3);
              }
              isInitialChunk = false;
            }
            callback(null, chunk);
          }
        });

        const csvStream = fs.createReadStream(filePath)
          .pipe(removeBomTransform)
          .pipe(csv({ separator: ',' }));

        csvStream
          .on('data', (dataRow) => {
            const row = {
              departureTime: new Date(dataRow['Departure']),
              returnTime: new Date(dataRow['Return']),
              departureStationId: parseInt(dataRow['Departure station id']),
              returnStationId: parseInt(dataRow['Return station id']),
              coveredDistanceMeters: parseInt(dataRow['Covered distance (m)']),
              durationSeconds: parseInt(dataRow['Duration (sec.)']),
            };

            let errorCategory = null;
            if (isCoveredDistanceOrDurationTooSmall(row)) {
              errorCategory = 'Distance or Duration < 10';
            } else if (isDuplicateFields(row)) {
              errorCategory = 'Trip already in database';
            } else if (isForeignKeyInvalid(row)) {
              errorCategory = 'Depart- or Returnstation ID not in Bikestations ID-list';
            }

            if (errorCategory) {
              logStream.write(`${errorCategory}: ${JSON.stringify(row)}\n`);
            } else {
              rowsBatch.push(row);
            }

            if (rowsBatch.length === BATCH_SIZE) {
              csvStream.pause(); // pause reading until insertion is finished

              db.models.Biketrip.bulkCreate(rowsBatch, { ignoreDuplicates: true })
                .then(() => {
                  rowsBatch = [];
                  csvStream.resume(); // resume reading once insertion is finished
                })
                .catch(err => {
                  console.error(err);
                  logStream.write(`other error: ${JSON.stringify(rowsBatch)}\n`);
                  rowsBatch = [];
                  csvStream.resume(); // resume reading even if there was an error
                });
            }
          })
          .on('end', async () => {
            // Handle remaining rows in the batch
            if (rowsBatch.length > 0) {
              try {
                await db.models.Biketrip.bulkCreate(rowsBatch, { ignoreDuplicates: true });
              } catch (err) {
                console.error(err);
                logStream.write(`other error: ${JSON.stringify(rowsBatch)}\n`);
              }
              rowsBatch = [];
            }
            resolve();
          })
          .on('error', reject);
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    logStream.end();
  }
};

importData();
