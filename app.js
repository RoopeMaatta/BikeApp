/**
 * Desctiption: Setup and configure a Express.js web application
 */


const express = require("express"); // Import Express framework
const app = express(); // Make instance of Express
const routes = require("./routes"); // Import module from routes/index to routes
const path = require("path"); // import filepath module


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes); // Use/mount routes module

// use instances of above
// error handling


// Start the server
app.listen(3000, () => {
    console.log("the app is running on localhost: 3000")
});