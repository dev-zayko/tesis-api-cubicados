'use strict';

module.exports = (sequelize, DataTypes) => {
    const Cubages = sequelize.define("Cubages", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        area: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        depth: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        width: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        m3: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        dosage: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        gravel: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        sand: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        water: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        length: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        count: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        description: {
            type: DataTypes.JSON,
            allowNull: true
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
        construction_id: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'Constructions',
                key: 'id'
            },
            allowNull: false
        },
        room_id: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'Rooms',
                key: 'id'
            },
            allowNull: false
        },
        material_id: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'Materials',
                key: 'id'
            },
            allowNull: false
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'cubages'
    });
    Cubages.associate = function (models) {
        Cubages.belongsTo(models.Constructions, {
            as: "constructions",
            foreignKey: 'construction_id'
        })
        Cubages.belongsTo(models.Rooms, {
            as: "rooms",
            foreignKey: 'room_id'
        })
        Cubages.belongsTo(models.Materials, {
            as: "materials",
            foreignKey: 'material_id'
        })
    };
    return Cubages;
};
