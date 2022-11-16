'use strict';

module.exports = (sequelize, DataTypes) => {
    const Projects = sequelize.define("Projects", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [2, 255],
                    msg: 'El nombre debe tener entre 2 a 50 caracteres'
                }
            }
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true
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
        tableName: 'projects'
    });
    Projects.associate = function (models) {
        Projects.belongsTo(models.Users, {as: "users", foreignKey: 'id_user'})
        Projects.hasMany(models.Rooms, {as: 'rooms', foreignKey: 'id'})
    };
    return Projects;
};
