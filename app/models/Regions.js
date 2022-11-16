'use strict';

module.exports = (sequelize, DataTypes) => {
    const Regions = sequelize.define("Regions", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: [2, 255],
                    msg: 'El nombre debe tener entre 2 a 50 caracteres'
                }
            }
        },
        identifier: {
            type: DataTypes.STRING(5),
            allowNull: false
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'regions'
    });
    Regions.associate = function (models) {
        Regions.hasMany(models.Communes, {as: 'communes', foreignKey: 'id'});
    };
    return Regions;
};
