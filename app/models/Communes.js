'use strict';

module.exports = (sequelize, DataTypes) => {
    const Communes = sequelize.define('Communes', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                len: {
                    args: [2, 45],
                    msg: 'El nombre debe tener entre 2 a 50 caracteres'
                }
            }
        },
        region_id: {
            type: DataTypes.INTEGER,
            references:{
              model: 'Regions',
              key: 'id'
            },
            allowNull: false
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'communes'
    });
    Communes.associate = function (models) {
        Communes.hasMany(models.Materials, {as: 'materials', foreignKey: 'id'});
        Communes.belongsTo(models.Regions,{as: 'regions', foreignKey: 'region_id'});
    };
    return Communes;
};
