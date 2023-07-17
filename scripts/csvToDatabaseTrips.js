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
  const summaryLogStream = fs.createWriteStream(path.join(__dirname, 'unimportedTripsSummary.log'), { flags: 'a' });
  
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
      if (file === 'bikeStations.csv' || file === "testTrips.csv" || file === "_testTrips2.csv" || file === "2021-05.csv" || file === "2021-06.csv"  || file === "2021-07.csv") {
        console.log(`Skipping file: ${file}`);
        continue;
      }
      
      const errorCounts = {};
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
            departureStationId: Number(dataRow['Departure station id']),
            returnStationId: Number(dataRow['Return station id']),
            coveredDistanceMeters: Math.round(Number(dataRow['Covered distance (m)'])),
            durationSeconds: Number(dataRow['Duration (sec.)']),
          };
          
          
          
          
          // Check for missing data
          const isDataMissing = (row) => {
            const keys = ['departureTime', 'returnTime', 'departureStationId', 'returnStationId', 'coveredDistanceMeters', 'durationSeconds'];
            for (const key of keys) {
              if (row[key] === undefined) return true;
            }
            return false;
          };
          
          // Check for extra or missing data
          const hasIncorrectColumnCount = (dataRow) => {
            const expectedColumns = ['Departure', 'Return', 'Departure station id', 'Departure station name', 'Return station id', 'Return station name', 'Covered distance (m)', 'Duration (sec.)'];
            const dataRowColumns = Object.keys(dataRow);
            // Check if dataRow has any columns not included in the expected columns
            for (const column of dataRowColumns) {
              if (!expectedColumns.includes(column)) {
                return true;
              }
            }
            // Check if dataRow has fewer columns than expected
            if (dataRowColumns.length !== expectedColumns.length) {
              return true;
            }
            
            return false;
          };
          
          // Check for faulty data
          const isFaultyData = (row) => {
            const numericKeys = ['departureStationId', 'returnStationId', 'coveredDistanceMeters', 'durationSeconds'];
            for (const key of numericKeys) {
              if (isNaN(parseFloat(row[key])) || parseFloat(row[key]) !== parseInt(row[key]) || isNaN(Number(row[key]))) return true;
            }
            return false;
          };
          
          // Error checking
          errorCategory = null;
          let isValidRow = true;
          if (row.departureTime.toString() === 'Invalid Date' || row.returnTime.toString() === 'Invalid Date') {
            errorCategory = 'Invalid date';
            isValidRow = false;
          } else if (isDuplicateFields(row)) {
            errorCategory = 'Trip already in database';
            isValidRow = false;
          } else if (isCoveredDistanceOrDurationTooSmall(row)) {
            errorCategory = 'Distance or Duration < 10';
            isValidRow = false;
          } else if (isForeignKeyInvalid(row)) {
            errorCategory = 'Depart- or Returnstation ID not in Bikestations ID-list';
            isValidRow = false;
          } else if (hasIncorrectColumnCount(dataRow)) {
            errorCategory = 'Extra or missing column data';
            isValidRow = false;
          } else if (isDataMissing(row)) {
            errorCategory = 'Missing column data';
            isValidRow = false;
          } else if (isFaultyData(row)) {
            errorCategory = 'Faulty column data';
            isValidRow = false;
          }
          
          
          if (isValidRow) {
            rowsBatch.push(row);
          } else if (errorCategory) {
            logStream.write(`${errorCategory}: ${JSON.stringify(row)}\n`);
            errorCounts[errorCategory] = (errorCounts[errorCategory] || 0) + 1;
          } else {
            logStream.write(`Unknown error: ${JSON.stringify(row)}\n`);
            errorCounts['Unknown error'] = (errorCounts['Unknown error'] || 0) + 1;
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
              errorCounts['other error'] = (errorCounts['other error'] || 0) + 1;
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
      
      // After processing each file, write the summary to both log files
      const summary = `SUMMARY OF ERRORS IN FILE ${file}\n` +
      Object.entries(errorCounts)
        .map(([errorCategory, count]) => `${count} Errors found in category: ${errorCategory}\n`)
        .join('') + '\n';
      
      logStream.write(summary);
      summaryLogStream.write(summary);
      
      
    }
  } catch (err) {
    console.error(err);
  } finally {
    
    logStream.end();
    summaryLogStream.end();
  }
};

importData();
