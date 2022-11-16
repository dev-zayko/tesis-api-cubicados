'use strict';

module.exports = (sequelize, DataTypes) => {
    const Rooms = sequelize.define("Rooms", {
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
                    msg: 'El nombre debe tener entre 1 a 50 caracteres'
                }
            }
        },
        neto_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        final_amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        project_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Projects',
                key: 'id'
            },
            allowNull: false,
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
        tableName: 'rooms'
    });
    Rooms.associate = function (models) {
        Rooms.hasMany(models.Cubages, {as: 'cubages', foreignKey: 'id'});
        Rooms.belongsTo(models.Projects, {as: 'projects', foreignKey: 'project_id'});
    };
    return Rooms;
};
