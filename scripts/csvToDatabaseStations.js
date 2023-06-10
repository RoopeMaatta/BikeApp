const fs = require('fs'); // import filesystem tools module
const csv = require('csv-parser'); // import csv-parser module
const path = require('path'); // import filepath module
const db = require("../db"); // Import the models from index.js file
const filePath = path.join(__dirname, '..', 'data', 'bikeStations.csv');


const importData = async () => {
    try {
     // Use await with a Promise to handle the asynchronous reading of the CSV file
     await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath)
        .pipe(csv({ separator: ',' }))
        .on('data', async (row) => {
          // Check if the row should be imported based on the conditions
          //if (shouldImportRow(row)) {
            try {
                const { FID, ID, Nimi, Namn, Name, Osoite, Adress, Kaupunki, Stad, Operaattor, Kapasiteet, x, y } = row;
              // Create a Biketrip record using the model
              await db.models.Bikestation.create({
                // FID: parseInt(FID), // omitted due to assumption of not needing it
                ID: parseInt(ID),
                Nimi,
                Namn,
                Name,
                Osoite,
                Adress,
                // Kaupunki,
                // Stad,
                // Operaattor,
                Kapasiteet: parseInt(Kapasiteet),
                x: parseFloat(x),
                y: parseFloat(y),
                
              });
            } catch (error) {
              console.error('Error importing row:', error);
            }
          //}
        })
        .on('end', () => {
          console.log(`Data import completed for file: ${filePath}`);
          resolve(); // Resolve the promise when the stream ends
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject(error); // Reject the promise if there is an error reading the file
        });
    });
 // }

  console.log('All data import completed successfully!');
} catch (error) {
  console.error('Error importing data:', error);
}
};

  
 importData();