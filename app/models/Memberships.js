'use strict';

module.exports = (sequelize, DataTypes) => {
    const Memberships = sequelize.define("Memberships", {
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
                    args: [2, 50],
                    msg: 'El nombre debe tener entre 2 a 50 caracteres'
                }
            }
        },
        days: {
          type: DataTypes.INTEGER(11),
          allowNull: false
        },
        neto_amount: {
           type: DataTypes.INTEGER(11),
           allowNull: false,
        },
        discount: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        final_amount: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
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
        tableName: 'memberships'
    });
    Memberships.associate = function (models) {
        Memberships.hasMany(models.Users, {as: 'users', foreignKey:'id'})
    };
    return Memberships;
};
