/**
 * Description: Creates a test .csv file to be used as base for test database entries.
 */

// Import file system tools module
const fs = require("fs"); 

// Import paths tool module
const path = require("path");

// Make array of test data:
// Note the data has 20entries
// one has a 'Covered distance (m)'< 10
// one has a 'Duration (sec.)' < 10
const data = [
    [
      'Departure',
      'Return',
      'Departure station id',
      'Departure station name',
      'Return station id',
      'Return station name',
      'Covered distance (m)',
      'Duration (sec.)'
    ],
    ['2021-05-31 23:57:25', '2021-06-01 0:05:46', 94, 'Laajalahden aukio', 100, 'Teljäntie', 2043, 500],
    ['2021-05-31 23:56:59', '2021-06-01 0:07:14', 82, 'Töölöntulli', 113, 'Pasilan asema', 1870, 611],
    ['2021-05-31 23:56:44', '2021-06-01 0:03:26', 123, 'Näkinsilta', 121, 'Vilhonvuorenkatu', 1025, 399],
    ['2021-05-31 23:56:23', '2021-06-01 0:29:58', 4, 'Viiskulma', 65, 'Hernesaarenranta', 3, 2009],
    ['2021-05-31 23:56:11', '2021-06-01 0:02:02', 4, 'Viiskulma', 65, 'Hernesaarenranta', 1400, 9],
    ['2021-05-31 23:54:48', '2021-06-01 0:00:57', 292, 'Koskelan varikko', 133, 'Paavalinpuisto', 1713, 366],
    ['2021-05-31 23:54:11', '2021-06-01 0:17:11', 34, 'Kansallismuseo', 81, 'Stenbäckinkatu', 2550, 1377],
    ['2021-05-31 23:53:04', '2021-06-01 0:14:52', 240, 'Viikin normaalikoulu', 281, 'Puotila (M)', 5366, 1304],
    ['2021-05-31 23:52:03', '2021-06-01 0:15:16', 116, 'Linnanmäki', 117, 'Brahen puistikko', 3344, 1393],
    ['2021-05-31 23:50:19', '2021-06-01 0:05:58', 116, 'Linnanmäki', 145, 'Pohjolankatu', 3248, 935],
    ['2021-05-31 23:50:05', '2021-06-01 0:01:22', 147, 'Käpylän asema', 232, 'Oulunkylän asema', 1633, 672],
    ['2021-05-31 23:50:00', '2021-05-31 23:55:48', 69, 'Kalevankatu', 62, 'Välimerenkatu', 1131, 345],
    ['2021-05-31 23:49:59', '2021-05-31 23:59:49', 147, 'Käpylän asema', 232, 'Oulunkylän asema', 1695, 589],
    ['2021-05-31 23:49:59', '2021-05-31 23:55:38', 69, 'Kalevankatu', 62, 'Välimerenkatu', 1125, 336],
    ['2021-05-31 23:49:36', '2021-06-01 0:40:20', 547, 'Jämeräntaival', 547, 'Jämeräntaival', 1227, 3040],
    ['2021-05-31 23:49:18', '2021-06-01 0:05:09', 201, 'Länsisatamankuja', 41, 'Ympyrätalo', 4245, 948],
    ['2021-05-31 23:48:53', '2021-06-01 0:03:49', 30, 'Itämerentori', 50, 'Melkonkuja', 2656, 892],
    ['2021-05-31 23:48:44', '2021-05-31 23:56:06', 235, 'Katariina Saksilaisen katu', 239, 'Viikin tiedepuisto', 2107, 437],
    ['2021-05-31 23:47:49', '2021-05-31 23:51:11', 727, 'Ratsutori', 713, 'Upseerinkatu', 549, 198],
    ['2021-05-31 23:46:14', '2021-05-31 23:55:58', 137, 'Arabian kauppakeskus', 44, 'Sörnäinen (M)', 1970, 582],
] 
  
  

// Convert data array to csv format
const csv = data.map(row => row.join(',')).join('\n');

// Specify the file path using path.join()
const filePath = path.join(__dirname, '..', 'data', 'testTripsData.csv');


// Write the csv data to a file
fs.writeFile(filePath, csv, err => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('CSV file created successfully!');
  }
});