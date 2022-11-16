'use strict';

module.exports = (sequelize, DataTypes) => {
    const Materials = sequelize.define("Materials", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        trademark: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        despatch: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        pick_up: {
          type: DataTypes.STRING(200),
            allowNull: true
        },
        store_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Stores',
                key: 'id'
            },
            allowNull: false
        },
        commune_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Communes',
                key: 'id'
            },
            allowNull: false
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'materials'
    });
    Materials.associate = function (models) {
        Materials.hasMany(models.Cubages, {as: 'cubages', foreignKey: 'id'});
        Materials.belongsTo(models.Stores, {as: 'stores', foreignKey:'store_id'})
        Materials.belongsTo(models.Communes, {as: 'communes', foreignKey:'commune_id'})
    };
    return Materials;
};
