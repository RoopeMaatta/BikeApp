const fs = require('fs'); // import filesystem tools module
const csv = require('csv-parser'); // import csv-parser module
const path = require('path'); // import filepath module
const db = require("../db"); // Import the models from index.js file

const dataFolder = path.join(__dirname,'..', 'data'); // Path to the folder containing CSV files
const importData = async () => {
    try {
      const csvFiles = fs.readdirSync(dataFolder).filter(file => file.endsWith('.csv')); // array of .csv files in data-folder
       
        // for all but bikestation.csv continue
        for (const file of csvFiles) {
        if (file === 'bikeStations.csv') {
          console.log(`Skipping file: ${file}`);
          continue;
        }
        
        //define the looped files filepath
        const filePath = path.join(dataFolder, file);
        


        // funcition for skipping rows based on conditions
        const shouldImportRow = (row) => {
            const coveredDistanceMeters = parseInt(row['Covered distance (m)']);
            const durationSeconds = parseInt(row['Duration (sec.)']);
            return coveredDistanceMeters > 10 && durationSeconds > 10;
          };
          
     // Use await with a Promise to handle the asynchronous reading of the CSV file
     await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath)
        .pipe(csv({ separator: ',' }))
        .on('data', async (row) => {
          // Check if the row should be imported based on the conditions
          if (shouldImportRow(row)) {
            try {
              // Create a Biketrip record using the model
              await db.models.Biketrip.create({
                departureTime: row['Departure'],
                returnTime: row['Return'],
                departureStationId: parseInt(row['Departure station id']),
                // departureStationName: row['Departure station name'], // omitted due to assumption of perfomance optimization
                returnStationId: parseInt(row['Return station id']),
                // returnStationName: row['Return station name'],  // omitted due to assumption of perfomance optimization
                coveredDistanceMeters: parseInt(row['Covered distance (m)']),
                durationSeconds: parseInt(row['Duration (sec.)']),
              });
            } catch (error) {
              console.error('Error importing row:', error);
            }
          }
        })
        .on('end', () => {
          console.log(`Data import completed for file: ${file}`);
          resolve(); // Resolve the promise when the stream ends
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject(error); // Reject the promise if there is an error reading the file
        });
    });
  }

  console.log('All data import completed successfully!');
} catch (error) {
  console.error('Error importing data:', error);
}
};

  
 importData();