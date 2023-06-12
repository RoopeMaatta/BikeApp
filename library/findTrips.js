/**
 * Searches for bike trips in the database based on the given query parameters.
 *
 * @param {Object} query - The query parameters for the trip search.
 * @param {number} query.departureStationId - The ID of the departure station.
 * @param {number} query.returnStationId - The ID of the return station.
 * @param {string} query.departureTime - The earliest departure time (YYYY-MM-DD).
 * @param {string} query.returnTime - The latest return time (YYYY-MM-DD).
 * @param {number} query.coveredDistanceMeters - The covered distance in meters.
 * @param {number} query.durationSeconds - The duration of the trip in seconds.
 * 
 * @returns {Promise<string>} A promise that resolves with a JSON string of the found trips.
 */

// Import database object
const db = require('../db');
// Import Op (Operators) object from sequelize package. gte(≥) and lte(≤) are used
const { Op } = require('sequelize');


const findTrips = async (query) => {
 // Destructuring assignment to get each value in query to it's own const
  const {
    departureStationId,
    returnStationId,
    departureTime,
    returnTime,
    coveredDistanceMeters,
    durationSeconds
  } = query;

  // Construct the where clause. {} to be filled with key-value pairs
  let where = {};
  if (departureStationId) where.departureStationId = departureStationId;
  if (returnStationId) where.returnStationId = returnStationId;
  if (departureTime) where.departureTime = { [Op.gte]: new Date(departureTime) }; // gte = greater than or equal to
  if (returnTime) where.returnTime = { [Op.lte]: new Date(returnTime) }; // lto = less than or equal to
  if (coveredDistanceMeters) where.coveredDistanceMeters = coveredDistanceMeters;
  if (durationSeconds) where.durationSeconds = durationSeconds;

  // Query the database with where object as conditions
  const trips = await db.models.Biketrip.findAll({
    where,
    attributes: ['departureTime', 'returnTime', 'departureStationId', 'returnStationId', 'coveredDistanceMeters', 'durationSeconds'],
    include: [{
      model: db.models.Bikestation,
      as: 'DepartureStation', // as = alias for assosiation
      attributes: [] // do not include extra attributes from model
    },
    {
      model: db.models.Bikestation,
      as: 'ReturnStation',
      attributes: []
    }]
  });

  // Prepare the trips data by getting only the dataValues from the query, and not wrapped in a instance of a Sequelize model
  // trips(array of model instances) -> preparedTrips(array of dataValue)
  const preparedTrips = trips.map(trip => trip.dataValues);

  // Convert the trips data to a JSON string
  const jsonTrips = JSON.stringify(preparedTrips);

  console.log(`Found ${trips.length} trips.`);
  console.log(jsonTrips);

  return jsonTrips;
};

// Usage example
findTrips({
  departureStationId: 116,
  returnStationId: 117,
  departureTime: '2021-04-31',
  returnTime: '2021-07-01',
});

