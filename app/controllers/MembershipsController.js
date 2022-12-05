const {
    Memberships,
    User,
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
    async upMembership(req, res, next) {
        let idUser = req.user.id;
        let idMembership = req.idMembership;
        await User.update({
            membership_id: idMembership,
            user_status_id: 1,
        }, {
            where: {
                id: idUser
            }
        }).then((response) => {

            next();
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    },
    async addDate(req, res, next) {
        let date = await Membresias.findOne({
            where: {
                idMembresia: req.idMembresia
            }
        });
        let datemp = await MembresiasPagadas.findOne({
            where: {
                idMembresiaPagada: req.idMembresiaPagada
            }
        });
        req.fechaMembresia = moment(datemp.create_at, 'DD-MM-YYYY').add('days', date.dias)
        next();
    },
    async restDays(req, res, next) {
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(now);
        let fecha = moment(req.user.fechaMembresia).format('YYYY-MM-DD HH:mm:ss');
        let time = moment(now).diff(fecha, 'days')
        res.send({
            diasRestantes: time
        })
    }

}
