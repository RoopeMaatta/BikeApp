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
  departureTime: {
    in: ['query'],
    optional: true,
    isDate: true,
      // Valid date range fill be handled in the frontend input field
    errorMessage: 'departureTime should be a valid date',
  },
  returnTime: {
    in: ['query'],
    optional: true,
    isDate: true,
    // Valid date range fill be handled in the frontend input field
    errorMessage: 'returnTime should be a valid date',
  },
  coveredDistanceMeters: {
    in: ['query'],
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (value < 0) {
          throw new Error('coveredDistanceMeters should be a positive integer');
        }
        return true;
      }
    }
  },
  durationSeconds: {
    in: ['query'],
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (value < 0) {
          throw new Error('durationSeconds should be a positive integer');
        }
        return true;
      }
    }
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