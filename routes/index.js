/**
 * Description: Define a router module to interact with models and render views.
 */


const express = require("express"); // Import Express framework
const router = express.Router(); // Create instance of Express router middleware

const apiRoutes = require('./api'); // Import api.js
router.use('/api', apiRoutes); // mount the api routes any request starting with /api will be handled by api.js. 

// require other backendfiles

// async try-catch handler middleware

// Enpoints - get, put, post , delete
// 

// Create temporary test route
router.get('/', (req, res) => {
    res.send('Server is running! owo');
  });



  



module.exports = router; // export module to be used elsewhere
 