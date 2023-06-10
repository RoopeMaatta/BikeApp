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
        // Exclude the id column due optimization assumption - Primary key set to departure+return time&id
        departureTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "Departure time",
            primaryKey: true,
        },

        // Alternative For Departure time in Unix Time Stamp format
      //   departureTime: {
      //     type: DataTypes.BIGINT, // Store as big integer
      //     allowNull: false,
      //     field: "Departure",
      //     primaryKey: true,
      //     get() { // Convert Unix timestamp to Date when retrieving data
      //         const unixTimestamp = this.getDataValue('departureTime');
      //         return new Date(unixTimestamp * 1000);
      //     },
      //     set(value) { // Convert Date to Unix timestamp when storing data
      //         if (!(value instanceof Date)) {
      //             value = new Date(value + 'Z'); // Append 'Z' to indicate UTC
      //         }
      //         this.setDataValue('departureTime', Math.floor(value.getTime() / 1000));
      //     }
      // },
      

          returnTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "Return time",
            primaryKey: true,
          },
          departureStationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "Departure station id",
            primaryKey: true,
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
            primaryKey: true,
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
        sequelize,
        timestamps: false,
        // formats Date not to have milliseconds when getting data
        getterMethods: {
          formattedDepartureTime() {
            const rawValue = this.getDataValue("departureTime");
            return rawValue.toISOString().slice(0, 19);
          },
          formattedReturnTime() {
            const rawValue = this.getDataValue("returnTime");
            return rawValue.toISOString().slice(0, 19);
          },
        },
    }
    );
    return Biketrip
};

