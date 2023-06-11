/**
 * description: library of used functions
 */


// Import database object
const db = require('./db');


/**
 * Finds all bike trips for a specific station and logs them to the console.
 *
 * @param {number} stationId - The ID of the station.
 * @param {'departureStationId'|'returnStationId'} type - The type of station (departure or return).
 * @returns {Promise<void>} Promise representing the operation.
 *
 * @example
 * findTripsByStation(4, 'departureStationId');
 */

// Define query function
const findTripsByStation = async (stationId, type) => {
  // Validate type
  if (!['departureStationId', 'returnStationId'].includes(type)) {
    console.error('Invalid type. Use either "departureStationId" or "returnStationId".');
    return;
  }

  // Query the database
  const trips = await db.models.Biketrip.findAll({
    where: {
      [type]: stationId
    },
    attributes: ['departureTime', 'returnTime', 'departureStationId', 'returnStationId', 'coveredDistanceMeters', 'durationSeconds'], // Wanted columns data
    include: [
      {
        model: db.models.Bikestation,
        as: type === 'departureStationId' ? 'DepartureStation' : 'ReturnStation',
        attributes: [] // No other attributes from Bikestation model
      }
    ]
  });

  // Log the trips
  console.log(`Found ${trips.length} trips from station ${stationId} as a ${type === 'departureStationId' ? 'departure' : 'return'} station.`);
  trips.forEach(trip => {
    console.log(trip.dataValues);
});

}

// Usage example
findTripsByStation(4, 'departureStationId');
