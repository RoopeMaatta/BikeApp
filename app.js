/**
 * Desctiption: Setup and configure a Express.js web application
 */


const express = require("express"); // Import Express framework
const app = express(); // Make instance of Express


const routes = require("./routes"); // Import module from routes path to routes
app.use("/", routes); // Use/mount routes module


// use instances of above
// error handling





// Start the server
app.listen(3000, () => {
    console.log("the app is running on localhost: 3000")
});