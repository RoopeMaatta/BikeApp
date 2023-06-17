/**
 * Fetches station names from the database for search suggestions.
 *
 * @returns {Promise<string>} A promise that resolves with a JSON string of the found station names.
 */

// Import database object
const db = require('../db');

const getSuggestions = async (req, res, next) => {
  // Query the database for station names
  const stations = await db.models.Bikestation.findAll({
    attributes: ['Nimi'] // Only fetch the 'Nimi' column
  });

  // Prepare the stations data by getting only the dataValues from the query
  const preparedStations = stations.map(station => station.dataValues.Nimi);

  // Respond with the prepared data
  res.json(preparedStations);
};

module.exports = { getSuggestions };
