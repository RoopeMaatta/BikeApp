/**
 * Description: exports a model for of biketrips enabling the app to interact with the data in the database.
 */


const Sequelize = require("sequelize"); // Import sequelize orm module

// export placeholder function for model definition
module.exports = (sequelize, DataTypes) => {
    class Biketrip extends Sequelize.Model {}   // create subclass 
    
    Biketrip.init(
    // first object field definitions    
    {
        // An autoincrementin ID is left out due to an assumption of performance optimization
        departureTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "Departure",
          },
          returnTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "Return"
          },
          departureStationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "Departure station id",
          }, 
        // Ommited due to getting the same data from departureStationId + Bikestations table  
        //   departureStationName: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //   },
          returnStationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "Return station id",
          },
        // Ommited due to getting the same data from departureStationId + Bikestations table 
        //   returnStationName: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //   },
          coveredDistanceMeters: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "Covered distance (m)",
            validate: {
                // (no distance < 10) handled in csv-parser script 
            },
          },
          durationSeconds: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "Duration (sec.)",
            validate: {
                // (no duration < 10) handled in csv-parser script
            },
          },
    },
    // second object to configure the model
    {
        sequelize
    }
    );

    return Biketrip
};