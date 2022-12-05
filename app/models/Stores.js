'use strict';

module.exports = (sequelize, DataTypes) => {
    const Stores = sequelize.define("Stores", {
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
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'stores'
    });
    Stores.associate = function (models) {
        Stores.hasMany(models.Materials, {as: 'materials', foreignKey: 'id'});
    };
    return Stores;
};
