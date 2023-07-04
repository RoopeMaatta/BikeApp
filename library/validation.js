/**
 * Desription: Middleware for validating data input
 */

const { checkSchema, validationResult } = require('express-validator');


// Validation conditions
exports.findTripsValidation = checkSchema({
  departureStationIds: {
    in: ['query'],
    optional: true,
    isArray: true,
    // Valid station names will be handled in the frontend input field with suggestions
    errorMessage: 'departureStationIds should be an array',
  },
  returnStationIds: {
    in: ['query'],
    optional: true,
    isArray: true,
    // Valid station names will be handled in the frontend input field with suggestions
    errorMessage: 'returnStationIds should be an array',
  },
  departureDate: {
    in: ['query'],
    optional: true,
    isDate: true,
    // Valid date range fill be handled in the frontend input field
    errorMessage: 'departureDate should be a valid date',
  },
  returnDate: {
    in: ['query'],
    optional: true,
    isDate: true,
    // Valid date range fill be handled in the frontend input field
    errorMessage: 'returnDate should be a valid date',
  },
  departureTimeMin: {
    in: ['query'],
    optional: true,
    matches: {
      options: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      errorMessage: 'departureTimeMin should be a valid time in the format HH:MM',
    }
  },
  departureTimeMax: {
    in: ['query'],
    optional: true,
    matches: {
      options: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      errorMessage: 'departureTimeMax should be a valid time in the format HH:MM',
    }
  },
  returnTimeMin: {
    in: ['query'],
    optional: true,
    matches: {
      options: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      errorMessage: 'returnTimeMin should be a valid time in the format HH:MM',
    }
  },
  returnTimeMax: {
    in: ['query'],
    optional: true,
    matches: {
      options: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      errorMessage: 'returnTimeMax should be a valid time in the format HH:MM',
    }
  },  
  coveredDistanceMetersMin: {
    in: ['query'],
    optional: true,
    isInt: {
      options: { min: 0 },
      errorMessage: 'coveredDistanceMetersMin should be a positive integer or zero',
    },
  },
  coveredDistanceMetersMax: {
    in: ['query'],
    optional: true,
    isInt: {
      options: { min: 0 },
      errorMessage: 'coveredDistanceMetersMax should be a positive integer or zero',
    },
  },


  durationHoursMin: {
  in: ['query'],
  optional: true,
  isNumeric: {
    errorMessage: 'durationHoursMin should be a number'
  },
  isInt: {
    options: { min: 0 },
    errorMessage: 'durationHoursMin should be a positive integer or zero',
  },
},
durationMinutesMin: {
  in: ['query'],
  optional: true,
  isNumeric: {
    errorMessage: 'durationMinutesMin should be a numeric value'
  },
  isInt: {
    options: { min: 0 },
    errorMessage: 'durationMinutesMin should be a positive integer or zero',
  },
},
durationSecondsMin: {
  in: ['query'],
  optional: true,
  isNumeric: {
    errorMessage: 'durationSecondsMin should be a numeric value'
  },
  isInt: {
    options: { min: 0 },
    errorMessage: 'durationSecondsMin should be a positive integer or zero',
  },
},
durationHoursMax: {
  in: ['query'],
  optional: true,
  isInt: {
    options: { min: 0 },
    errorMessage: 'durationHoursMax should be a positive integer or zero',
  },
},
durationMinutesMax: {
  in: ['query'],
  optional: true,
  isInt: {
    options: { min: 0 },
    errorMessage: 'durationMinutesMax should be a positive integer or zero',
  },
},
durationSecondsMax: {
  in: ['query'],
  optional: true,
  isInt: {
    options: { min: 0 },
    errorMessage: 'durationSecondsMax should be a positive integer or zero',
  },
},



  // Add validation for pagination parameters
  pageSize: {
    in: ['query'],
    optional: true,
    isInt: { 
      options: { min: 1 },
      errorMessage: 'pageSize should be an integer greater than 0',
    },
    toInt: true,  // Convert the input to an integer
  },
  pageNumber: {
    in: ['query'],
    optional: true,
    isInt: { 
      options: { min: 1 },
      errorMessage: 'pageNumber should be an integer greater than 0',
    },
    toInt: true,  // Convert the input to an integer
  },
  
});

// Wrap Validation into middleware function for easier use.
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};