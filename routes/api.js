/**
 * Description: handle API endpoints
 */

const express = require('express');
const router = express.Router();
const { findTrips } = require('../library');

// Handler function to wrap each route
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
  }


router.get('/findTrips', asyncHandler(findTrips));

module.exports = router;