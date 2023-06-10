/**
 * Desctiption: Collects and exports models and related objects for interacting with the database
 */


const path = require("path"); // Import filepath module

const Sequelize = require("sequelize"); // Import sequelize orm module
const sequelize = new Sequelize({ // Make usable instance & pass configuration object parameters
    dialect: "sqlite",
    storage: path.join(__dirname, "../database.db"), // saves to current directory
    logging: false, // disable logging
    define: {
        timestamps: false,
    },
}); 


// Immediately invokes a funtion to try and test connection to database
(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection to the database successful');
    } catch (error) {
      console.error('Error connecting to the database: ', error);
    }
  })();

// Createted for exporting seqyalize module + instance + a models object that is to be filled
const db = {
    sequelize,
    Sequelize,
    models: {},
};

// add models to db: db.models.XXX require("modelspath/filename.js")
db.models.Biketrip = require("./models/biketrip.js")(sequelize, Sequelize.DataTypes);
db.models.Bikestation = require("./models/bikestation.js")(sequelize, Sequelize.DataTypes);

// Synchronize the models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

// export db
module.exports = db;