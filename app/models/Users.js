'use strict';

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        first_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        second_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        father_last_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        mother_last_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: [8, 255],
                    msg: 'La clave debe tener un minimo de 8 caracteres'
                }
            }
        },
        reset_password_token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        remember_token: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        actived_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        suspended_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        blocked_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        baned_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 0
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
        user_status_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'UserStatus',
                key: 'id'
            },
            allowNull: true,
            defaultValue: 1
        },
        profile_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Profiles',
                key: 'id'
            },
            allowNull: false,
            defaultValue: 2
        },
        membership_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Memberships',
                key: 'id'
            },
            allowNull: false,
            defaultValue: 1
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'users'
    });
    Users.associate = function (models) {
        Users.hasMany(models.Projects, {as: 'projects', foreignKey: 'id'});
        Users.belongsTo(models.Memberships, {as: 'memberships', foreignKey: 'membership_id'});
        Users.belongsTo(models.Profiles, {as: 'profiles', foreignKey: 'profile_id'});
        Users.belongsTo(models.UserStatus, {as: 'user_status', foreignKey: 'user_status_id'});
    };
    return Users;
};
