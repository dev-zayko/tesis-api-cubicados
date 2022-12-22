'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserLogins = sequelize.define("UserLogins", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false
        },
        login_datetime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_agent: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type_of_device: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        browser_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        operating_system: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        device_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'user_logins'
    });
    UserLogins.associate = function (models) {
        UserLogins.belongsTo(models.Users, {as: "users", foreignKey: 'user_id'})
    };
    return UserLogins;
};
