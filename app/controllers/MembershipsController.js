const {
    Memberships,
    Users,
    PaidMemberships
} = require('../models/index');
const {
    Op
} = require("sequelize");
const {
    response
} = require('express');
const moment = require('moment');

module.exports = {
    async getAll(req, res, next) {
        await Memberships.findAll({
            where: {
                id: {
                    [Op.gt]: 1,
                },
                deleted: false
            }
        }).then((response) => {
            res.send({
                data: response
            })
        }).catch((err) => {
            res.sendStatus(500);
        });
    },
    async restDays(req, res, next) {
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(now);
        let fecha = moment(req.user.expire_at).format('YYYY-MM-DD HH:mm:ss');
        let time = moment(now).diff(fecha, 'days')
        res.send({
            restDays: Math.abs(time)
        })
    },
    async addDate(req, res, next) {
        try {
            let date = await Memberships.findOne({
                where: {
                    id: req.idMembership
                }
            });
            let datemp = await PaidMemberships.findOne({
                where: {
                    id: req.idPaidMembership
                }
            });
            req.dateMemberships = moment(datemp.created_at, 'DD-MM-YYYY').add('days', date.days)
            next();
        } catch (error) {
            res.send({
                error: error.message
            })
        }
    },
    async upMembership(req, res, next) {
        let idUser = req.user.id;
        let idMembership = req.idMembership;
        await Users.update({
            membership_id: idMembership,
            user_status_id: 1,
            expire_at: req.dateMemberships
        }, {
            where: {
                id: idUser
            }
        }).then((response) => {
            res.send({
                status: "success",
                data: response
            });
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    },

}
