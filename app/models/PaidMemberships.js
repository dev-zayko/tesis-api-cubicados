'use-strict';

module.exports = (sequelize, DataTypes) => {
    const PaidMemberships = sequelize.define("Paid_memberships", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            preferences: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false
        },
        membership_id: {
            type: DataTypes.INTEGER(11),
            preferences: {
                model: 'Memberships',
                key: 'id'
            },
            allowNull: false
        },
        neto_amount: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        discount: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        final_amount: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        buy_order: {
            type: DataTypes.INTEGER(6),
            allowNull: false
        },
        session_id: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'paid_memberships'
    });
    PaidMemberships.associate = function (models) {
        PaidMemberships.belongsTo(models.Memberships, {
            as: "memberships",
            foreignKey: 'membership_id'
        })
        PaidMemberships.belongsTo(models.Users, {
            as: "users",
            foreignKey: 'user_id'
        })
    };
    return PaidMemberships;
}
