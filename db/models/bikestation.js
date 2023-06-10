/**
 * Description: exports a model for of bikestations enabling the app to interact with the data in the database.
 */

const Sequelize = require("sequelize"); // Import sequelize orm module

// export placeholder function for model definition
module.exports = (sequelize, DataTypes) => {
    class Bikestation extends Sequelize.Model {}  // create subclass 

    Bikestation.init(
        // first object field definitions    
        {
            // Commented Out for serving the same purpose as ID
            // FID: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            // },
            ID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            Nimi: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Namn: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Osoite: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Adress: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            // Commented Out for not needing said data
            // Kaupunki: {
            //     type: DataTypes.STRING,
            //     allowNull: true,
            // },
            // Stad: {
            //     type: DataTypes.STRING,
            //     allowNull: true,
            // },
            // Operaattor: {
            //     type: DataTypes.STRING,
            //     allowNull: true,
            // },
            Kapasiteet: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            x: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            y: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        // second object to configure the model
        {
            sequelize,
            timestamps: false, 
        }
    );

    return Bikestation;
};
