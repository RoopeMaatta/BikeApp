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

//import pagination helperfunctions
const { paginate, getPaginationMetadata } = require('../library/paginate');


const findTrips = async (req, res, next) => {
  // Destructuring assignment to get each value in query to it's own const
  const {
    departureStationIds,
    returnStationIds,
    departureDate,
    departureTimeMin,
    departureTimeMax,
    returnDate,
    returnTimeMin,
    returnTimeMax,
    coveredDistanceMetersMin,
    coveredDistanceMetersMax,
    durationHoursMin,
    durationMinutesMin,
    durationSecondsMin,
    durationHoursMax,
    durationMinutesMax,
    durationSecondsMax,
    //sortingField,
    sortingOrder, 
  } = req.query;
  
  const sortingField = (req.query.sortingField) ? req.query.sortingField.split(',') : [];
  
  // Construct the where clause. {} to be filled with key-value pairs
  let where = {};
  if (departureStationIds) where.departureStationId = { [Op.in]: departureStationIds }; // Op.in any value within array of values
  if (returnStationIds) where.returnStationId = { [Op.in]: returnStationIds };
  


  const createDateConstraint = (date, fieldName) => {
    let dateFilter = db.sequelize.where(
      db.sequelize.fn('date', db.sequelize.col(fieldName)),
      date
    );
  
    return dateFilter;
  };
  
  // if (departureDate) {
  //   let departureDateTime = new Date(departureDate).getTime() / 1000;  // convert to Unix timestamp
  //   where.departureTime = { [Op.gte]: departureDateTime };
  // }
  
  // if (returnDate) {
  //   let returnDateTime = new Date(returnDate).getTime() / 1000; // convert to Unix timestamp
  //   where.returnTime = { [Op.lte]: returnDateTime };
  // }

  if (departureDate) {
    where[Op.and] = [
      ...where[Op.and] || [],
      createDateConstraint(departureDate, 'departureTime'),
    ];
  }
  
  if (returnDate) {
    where[Op.and] = [
      ...where[Op.and] || [],
      createDateConstraint(returnDate, 'returnTime'),
    ];
  }
  
  
  function getTimeInMinutes(time) {
    let [hours, minutes] = time.split(':');
    return Number(hours) * 60 + Number(minutes);
  }
  
  const createTimeConstraint = (timeMin, timeMax, fieldName) => {
    let timeMinMinutes = timeMin && getTimeInMinutes(timeMin);
    let timeMaxMinutes = timeMax && getTimeInMinutes(timeMax);
  
    let timeFilter = [];
    if (timeMinMinutes !== undefined) {
      timeFilter.push(
        db.sequelize.where(
          db.sequelize.literal(
            `((((${fieldName} / 3600) % 24) * 60) + ((${fieldName} / 60) % 60))`
          ),
          '>=',
          timeMinMinutes
        )
      );
    }
    if (timeMaxMinutes !== undefined) {
      timeFilter.push(
        db.sequelize.where(
          db.sequelize.literal(
            `((((${fieldName} / 3600) % 24) * 60) + ((${fieldName} / 60) % 60))`
          ),
          '<=',
          timeMaxMinutes
        )
      );
    }
  
    return timeFilter;
  };
  
  if (departureTimeMin || departureTimeMax) {
    where[Op.and] = [
      ...where[Op.and] || [],
      ...createTimeConstraint(departureTimeMin, departureTimeMax, 'departureTime')
    ];
  }
  
  if (returnTimeMin || returnTimeMax) {
    where[Op.and] = [
      ...where[Op.and] || [],
      ...createTimeConstraint(returnTimeMin, returnTimeMax, 'returnTime')
    ];
  }
  
  if (coveredDistanceMetersMin || coveredDistanceMetersMax) {
    where.coveredDistanceMeters = {}; 
    if (coveredDistanceMetersMin) where.coveredDistanceMeters[Op.gte] = Number(coveredDistanceMetersMin);
    if (coveredDistanceMetersMax) where.coveredDistanceMeters[Op.lte] = Number(coveredDistanceMetersMax);
  }
  
  if (durationHoursMin || durationMinutesMin || durationSecondsMin || durationHoursMax || durationMinutesMax || durationSecondsMax) {
    where.durationSeconds = {};
  
    let durationSecondsMinTotal = (Number(durationHoursMin || 0) * 3600) + (Number(durationMinutesMin || 0) * 60) + Number(durationSecondsMin || 0);
    let durationSecondsMaxTotal = (Number(durationHoursMax || 0) * 3600) + (Number(durationMinutesMax || 0) * 60) + Number(durationSecondsMax || 0);
  
    if (durationSecondsMinTotal) where.durationSeconds[Op.gte] = durationSecondsMinTotal;
    if (durationSecondsMaxTotal) where.durationSeconds[Op.lte] = durationSecondsMaxTotal;
  
  }
  

  

  // Extract page size and page number from query parameters
  const { pageSize, pageNumber } = req.query;
  // Get pagination configuration
  const pagination = paginate(pageSize, pageNumber);
  // Get pagination metadata
  const paginationMetadata = await getPaginationMetadata(db.models.Biketrip, where, pageSize, pageNumber);


   // Create an empty array for the order parameters
   let order = [];
   // Check if sorting parameters are provided
   if (sortingField && sortingOrder) {
     // Iterate over each sorting field
     sortingField.forEach(field => {
       // Based on the value of the field, push the correct order array
       switch(field) {
         case 'departureStationIds':
           order.push([{ model: db.models.Bikestation, as: 'DepartureStation' }, 'Nimi', sortingOrder]);
           break;
         case 'departureDate':
           order.push([db.sequelize.literal('date(datetime(departureTime, \'unixepoch\'))'), sortingOrder]);
           break;
         case 'departureTime':
           order.push([db.sequelize.literal('time(datetime(departureTime, \'unixepoch\'))'), sortingOrder]);
           break;
         case 'returnStationIds':
           order.push([{ model: db.models.Bikestation, as: 'ReturnStation' }, 'Nimi', sortingOrder]);
           break;
         case 'returnDate':
           order.push([db.sequelize.literal('date(datetime(returnTime, \'unixepoch\'))'), sortingOrder]);
           break;
         case 'returnTime':
           order.push([db.sequelize.literal('time(datetime(returnTime, \'unixepoch\'))'), sortingOrder]);
           break;
         case 'coveredDistanceMeters':
           order.push(['coveredDistanceMeters', sortingOrder]);
           break;
         case 'duration':
           order.push(['durationSeconds', sortingOrder]);
           break;
       }
     });
   }



  // Query the database with where object as conditions
  const trips = await db.models.Biketrip.findAll({
    where,
    ...pagination,
    order: order,

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
  

// Average trip and upsfhit it to be first of prepared trips
if (trips.length > 0) {
// Find average trip details and departure/return station counts
const averageTripDetails = await db.models.Biketrip.findOne({
  where,
  attributes: [
    [db.Sequelize.fn('avg', db.Sequelize.col('departureTime')), 'avgDepartureTime'],
    [db.Sequelize.fn('avg', db.Sequelize.col('returnTime')), 'avgReturnTime'],
    [db.Sequelize.fn('avg', db.Sequelize.col('coveredDistanceMeters')), 'avgDistance'],
    [db.Sequelize.fn('avg', db.Sequelize.col('durationSeconds')), 'avgDuration'],
    [db.Sequelize.fn('count', db.Sequelize.fn('distinct', db.Sequelize.col('departureStationId'))), 'departureStationCount'],
    [db.Sequelize.fn('count', db.Sequelize.fn('distinct', db.Sequelize.col('returnStationId'))), 'returnStationCount'],
  ],
  raw: true,
});
// Prepare average trip data
let avgTrip = {
  'departureTime': formatDate(Math.round(averageTripDetails.avgDepartureTime)),
  'returnTime': formatDate(Math.round(averageTripDetails.avgReturnTime)),
  'coveredDistanceMeters': averageTripDetails.avgDistance,
  'durationSeconds': Math.round(averageTripDetails.avgDuration),
  'departureStationName': averageTripDetails.departureStationCount > 1 ? 'Multiple stations' : preparedTrips[0].departureStationName,
  'returnStationName': averageTripDetails.returnStationCount > 1 ? 'Multiple stations' : preparedTrips[0].returnStationName,
};
// Insert average trip at the beginning of the preparedTrips array
preparedTrips.unshift(avgTrip);
}
  
  console.log(`Found ${trips.length} trips.`);
  // console.log(jsonTrips);
  
  res.json({
    data: [preparedTrips],
    pagination: {
      totalRecords: paginationMetadata.totalRecords,
      totalPages: paginationMetadata.totalPages,
      currentPage: pageNumber,
      pageSize
    }
  });
  
};



module.exports = { findTrips };