/**
 * Description: exports a model for of biketrips enabling the app to interact with the data in the database.
 */


const Sequelize = require("sequelize"); // Import sequelize orm module

// function correctTimestampFormat(timestamp) {
//   if (timestamp.length < 20) { // Length of a correct timestamp (YYYY-MM-DDTHH:mm:ss)
//       const splitTimestamp = timestamp.split('-');
//       if (splitTimestamp[0].length === 1) { // Year is only one digit
//           splitTimestamp[0] = '202' + splitTimestamp[0]; // Assume we are in the 2020s
//           return splitTimestamp.join('-');
//       }
//   }
//   return timestamp; // If timestamp is correct, return as is
// }




// export placeholder function for model definition
module.exports = (sequelize, DataTypes) => {
    class Biketrip extends Sequelize.Model {   // create subclass 
      static associate(models) { // Create associations between models
        this.belongsTo(models.Bikestation, { as: 'DepartureStation', foreignKey: 'departureStationId' }); // as = alias. used when fetching associated object. ForeignKey links to primaryKey = ID
        this.belongsTo(models.Bikestation, { as: 'ReturnStation', foreignKey: 'returnStationId' });
    }     
    }  
    

    
    Biketrip.init(
    // first object field definitions    
    {
        // Exclude the id column due optimization assumption - Primary key set to departure+return time&id
        
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        
        departureTime: {
          type: DataTypes.BIGINT,
          allowNull: false,
          get() {
              const unixTimestamp = this.getDataValue('departureTime');
              return new Date(unixTimestamp * 1000);
          },
          set(value) {
            if (value) {
              this.setDataValue('departureTime', Math.floor(new Date(value).getTime() / 1000));
            }
          },
          // set(value) {
          //   const correctedValue = correctTimestampFormat(value.replace(/T(\d):/, 'T0$1:'));
          //   this.setDataValue('departureTime', new Date(correctedValue).getTime() / 1000);
          // },
        
      },
      returnTime: {
          type: DataTypes.BIGINT,
          allowNull: false,
          get() {
              const unixTimestamp = this.getDataValue('returnTime');
              return new Date(unixTimestamp * 1000);
          },
          set(value) {
            if (value) {
              this.setDataValue('returnTime', Math.floor(new Date(value).getTime() / 1000));
            }
          },
          // set(value) {
          //   const correctedValue = correctTimestampFormat(value.replace(/T(\d):/, 'T0$1:'));
          //   this.setDataValue('returnTime', new Date(correctedValue).getTime() / 1000);
          // },
        
      },
      

          departureStationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          }, 
        // Ommited due to getting the same data from departureStationId + Bikestations table  
        //   departureStationName: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //   },
          returnStationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        // Ommited due to getting the same data from departureStationId + Bikestations table 
        //   returnStationName: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //   },
          coveredDistanceMeters: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                // (no distance < 10) handled in csv-parser script 
            },
          },
          durationSeconds: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        indexes: [{
          unique: true,
          fields: ['departureTime', 'returnTime', 'departureStationId', 'returnStationId', 'coveredDistanceMeters', 'durationSeconds']
        }],
    }
    );
    return Biketrip
};

