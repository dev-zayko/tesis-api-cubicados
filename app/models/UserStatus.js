'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserStatus = sequelize.define("UserStatus", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: [2, 255],
                    msg: 'La descripcion debe tener entre 2 a 50 caracteres'
                }
            }
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false
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
        tableName: 'user_status'
    });
    UserStatus.associate = function (models) {
        UserStatus.hasMany(models.Users, { as: 'users', foreignKey: 'id' });
    };
    return UserStatus;
};
