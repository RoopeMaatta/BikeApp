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


// Createted for exporting seqyalize module + instance + a models object that is to be filled
const db = {
    sequelize,
    Sequelize,
    models: {},
};

// add models to db: db.models.XXX require("modelspath/filename.js")
db.models.Biketrip = require("./models/biketrip.js")(sequelize, Sequelize.DataTypes);
db.models.Bikestation = require("./models/bikestation.js")(sequelize, Sequelize.DataTypes);


// Call associate methods: For each model in db.models that has an associate method, call that method with db.models as the argument.
Object.values(db.models) // convert object into array
  .filter(model => typeof model.associate === "function") // filter on only elements with associate methods
  .forEach(model => model.associate(db.models)); // call fileterd method with db.models as argument = creates connection between db and associations



// Synchronize the models with the database. In production environment generally best to use migrations for schema changes, especially in a production environment 
sequelize.sync() //  takes an optional options object {force: true}, {alter: true}
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

// export db
module.exports = db;