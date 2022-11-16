'use strict';

module.exports = (sequelize, DataTypes) => {
    const ConstructionType = sequelize.define("ConstructionType", {
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
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'construction_type'
    });
    ConstructionType.associate = function (models) {
         ConstructionType.hasMany(models.Constructions, {as: "constructions", foreignKey: "id"});
    };
    return ConstructionType;
};
