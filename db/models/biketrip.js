/**
 * Description: exports a model for of biketrips enabling the app to interact with the data in the database.
 */


const Sequelize = require("sequelize"); // Import sequelize orm module

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
        
        departureTime: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          get() {
              const unixTimestamp = this.getDataValue('departureTime');
              return new Date(unixTimestamp * 1000);
          },
          set(value) {
              this.setDataValue('departureTime', Math.floor(new Date(value).getTime() / 1000));
          }
      },
      
      
      returnTime: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        get() {
            const unixTimestamp = this.getDataValue('returnTime');
            return new Date(unixTimestamp * 1000);
        },
        set(value) {
            this.setDataValue('returnTime', Math.floor(new Date(value).getTime() / 1000));
        }
    },

          departureStationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    }
    );
    return Biketrip
};

