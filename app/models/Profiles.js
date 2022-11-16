'use strict';

module.exports = (sequelize, DataTypes) => {
    const Profiles = sequelize.define("Profiles", {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isAlpha: {
                    msg: 'El nombre solo puede contener letras'
                },
                len: {
                    args: [2, 50],
                    msg: 'El nombre debe tener entre 2 a 50 caracteres'
                }
            }
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
        profile_type_id : {
            type: DataTypes.INTEGER,
            references : {
             model: 'ProfilesType',
             key: 'id'
            },
            allowNull: false
         },
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'Profiles'
    });
    Profiles.associate = function (models) {
        Profiles.hasMany(models.Users,{as:'users', foreignKey:'id'});
        // Profiles.belongsTo(models.profilesType,{as:'profilesType', foreignKey:'profile_type_id'})
    };
    return Profiles;
};
