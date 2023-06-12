/**
 * Description: Define a router module to interact with models and render views.
 */


const express = require("express"); // Import Express framework
const router = express.Router(); // Create instance of Express router middleware
const path = require("path"); // import filepath module

const apiRoutes = require('./api'); // Import api.js
router.use('/api', apiRoutes); // mount the api routes any request starting with /api will be handled by api.js. 


// require other backendfiles

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

// Enpoints - get, put, post , delete

// Serve the homepage
router.get('/', asyncHandler((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
}));



  



module.exports = router; // export module to be used elsewhere
 