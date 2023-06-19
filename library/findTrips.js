/**
* Searches for bike trips in the database based on the given query parameters.
*
* @param {Object} query - The query parameters for the trip search.
* @param {number[]} query.departureStationIds - The IDs of the departure stations.
* @param {number[]} query.returnStationIds - The IDs of the return stations.
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
const { Sequelize, Op } = require('sequelize');

const findTrips = async (req, res, next) => {
  // Destructuring assignment to get each value in query to it's own const
  const {
    departureStationIds,
    returnStationIds,
    departureDate,
    departureTime,
    returnDate,
    returnTime,
    coveredDistanceMetersMin,
    coveredDistanceMetersMax,
    durationSecondsMin,
    durationSecondsMax
  } = req.query;
  
  
  
  
  
  // Construct the where clause. {} to be filled with key-value pairs
  let where = {};
  if (departureStationIds) where.departureStationId = { [Op.in]: departureStationIds }; // Op.in any value within array of values
  if (returnStationIds) where.returnStationId = { [Op.in]: returnStationIds };
  
  if (departureDate) {
    let departureDateTime = new Date(departureDate).getTime() / 1000;  // convert to Unix timestamp
    where.departureTime = { [Op.gte]: departureDateTime };
  }
  
  if (returnDate) {
    let returnDateTime = new Date(returnDate).getTime() / 1000; // convert to Unix timestamp
    where.returnTime = { [Op.lte]: returnDateTime };
  }
  
  if (departureTime) {
    let [hours, minutes] = departureTime.split(':');
    let totalMinutes = Number(hours) * 60 + Number(minutes);
    where[Op.and] = [
      ...where[Op.and] || [],
      db.sequelize.where(
        db.sequelize.literal(
          `((((departureTime / 3600) % 24) * 60) + ((departureTime / 60) % 60))`
        ),
        '>=',
        totalMinutes
      ),
    ];
}

if (returnTime) {
    let [hours, minutes] = returnTime.split(':');
    let totalMinutes = Number(hours) * 60 + Number(minutes);
    where[Op.and] = [
      ...where[Op.and] || [],
      db.sequelize.where(
        db.sequelize.literal(
          `((((returnTime / 3600) % 24) * 60) + ((returnTime / 60) % 60))`
        ),
        '<=',
        totalMinutes
      ),
    ];
}

  
  
  if (coveredDistanceMetersMin || coveredDistanceMetersMax) {
    where.coveredDistanceMeters = {}; 
    if (coveredDistanceMetersMin) where.coveredDistanceMeters[Op.gte] = Number(coveredDistanceMetersMin);
    if (coveredDistanceMetersMax) where.coveredDistanceMeters[Op.lte] = Number(coveredDistanceMetersMax);
  }
  if (durationSecondsMin || durationSecondsMax) {
    where.durationSeconds = {};
    if (durationSecondsMin) where.durationSeconds[Op.gte] = Number(durationSecondsMin);
    if (durationSecondsMax) where.durationSeconds[Op.lte] = Number(durationSecondsMax);
  }
  
  
  console.log(where)
  // Query the database with where object as conditions
  const trips = await db.models.Biketrip.findAll({
    where,
    attributes: ['departureTime', 'returnTime', 'departureStationId', 'returnStationId', 'coveredDistanceMeters', 'durationSeconds'],
    include: [{
      model: db.models.Bikestation,
      as: 'DepartureStation', // as = alias for assosiation
      attributes: ["Nimi"] // include station name in the response and no extra attributes from models
    },
    {
      model: db.models.Bikestation,
      as: 'ReturnStation',
      attributes: ["Nimi"]
    }]
  });
  
  


  const formatDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month (0-indexed) and pad with 0 if necessary
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
    }  
  
  // Prepare the trips data by getting only the dataValues from the query, and not wrapped in a instance of a Sequelize model
  // trips(array of model instances) -> preparedTrips(array of dataValue)
  const preparedTrips = trips.map(trip => {
    // First get the data values of the trip
    const tripData = trip.dataValues;
    
    // Use the formatDate function to format the timestamps
    tripData.departureTime = formatDate(tripData.departureTime);
    tripData.returnTime = formatDate(tripData.returnTime);

    
    // Then add the station names
    tripData.departureStationName = trip.DepartureStation.Nimi;
    tripData.returnStationName = trip.ReturnStation.Nimi;
    
    // Remove the original DepartureStation and ReturnStation from tripData
    delete tripData.DepartureStation;
    delete tripData.ReturnStation;
    
    return tripData;
  });
  
  
  console.log(`Found ${trips.length} trips.`);
  // console.log(jsonTrips);
  
  res.json([preparedTrips, trips.length]);
};



module.exports = { findTrips };