'use strict';

module.exports = (sequelize, DataTypes) => {
    const Constructions = sequelize.define("Constructions", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'El nombre debe tener entre 2 a 50 caracteres'
                }
            }
        },
        construction_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ConstructionType',
                key: 'id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'constructions'
    });
    Constructions.associate = function (models) {
        Constructions.hasMany(models.Cubages, {as: 'cubages', foreignKey: 'id'});
        Constructions.belongsTo(models.ConstructionType, {as: "constructionType", foreignKey: 'construction_type_id'})
    };
    return Constructions;
};
