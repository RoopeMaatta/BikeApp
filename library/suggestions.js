/**
 * Fetches station names from the database for search suggestions.
 *
 * @returns {Promise<string>} A promise that resolves with a JSON string of the found station names.
 */

// Import database object
const db = require('../db');
const { Op } = require('sequelize'); // Import the Sequelize Operators.

const getSuggestions = async (req, res, next) => {
    const searchString = req.query.q.replace(/[%_]/g, ''); // Remove wildcard characters from user input
  
    const stations = await db.models.Bikestation.findAll({
      attributes: ['Nimi'],
      where: db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('Nimi')), 'LIKE', '%' + searchString.toLowerCase() + '%')
    });
  
    const preparedStations = stations.map(station => station.dataValues.Nimi);
  
    res.json(preparedStations);
  };
  

module.exports = { getSuggestions };
